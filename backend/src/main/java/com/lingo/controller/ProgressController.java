package com.lingo.controller;

import com.lingo.dto.Dto;
import com.lingo.repo.ContentRepository;
import com.lingo.repo.ProgressRepository;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Các endpoint cần đăng nhập: ghi nhận tiến độ học. */
@RestController
@RequestMapping("/api")
public class ProgressController {
    private final ProgressRepository progress;
    private final ContentRepository content;

    public ProgressController(ProgressRepository progress, ContentRepository content) {
        this.progress = progress;
        this.content = content;
    }

    @PostMapping("/me/languages/{lang}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void enroll(@AuthenticationPrincipal Long userId, @PathVariable String lang) {
        requireLanguage(lang);
        progress.enroll(userId, lang);
    }

    @GetMapping("/me/summary")
    public Dto.Summary summary(@AuthenticationPrincipal Long userId, @RequestParam String lang) {
        requireLanguage(lang);
        return progress.summary(userId, lang);
    }

    @PostMapping("/me/study")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void study(@AuthenticationPrincipal Long userId, @Valid @RequestBody Dto.StudyRequest req) {
        requireLanguage(req.lang());
        progress.logStudy(userId, req.lang(), req.minutes());
    }

    @PostMapping("/quiz/attempts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> attempt(@AuthenticationPrincipal Long userId, @Valid @RequestBody Dto.AttemptRequest req) {
        if (req.score() > req.total()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Điểm không được lớn hơn tổng số câu");
        }
        try {
            return Map.of("id", progress.saveAttempt(userId, req.lessonId(), req.score(), req.total()));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có bài học này");
        }
    }

    @PostMapping("/cards/{cardId}/review")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void review(@AuthenticationPrincipal Long userId, @PathVariable long cardId,
                       @RequestBody Dto.ReviewRequest req) {
        try {
            progress.reviewCard(userId, cardId, req.known());
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có thẻ này");
        }
    }

    private void requireLanguage(String lang) {
        if (!content.languageExists(lang)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có ngôn ngữ: " + lang);
        }
    }
}
