package com.lingo.controller;

import com.lingo.dto.Dto;
import com.lingo.repo.ContentRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Nội dung học theo ngôn ngữ. Công khai; nếu có token thì chặng hiển thị theo tiến độ người dùng. */
@RestController
@RequestMapping("/api/{lang}")
public class ContentController {
    private final ContentRepository content;

    public ContentController(ContentRepository content) {
        this.content = content;
    }

    @GetMapping("/units")
    public List<Dto.Unit> units(@PathVariable String lang, @AuthenticationPrincipal Long userId) {
        requireLanguage(lang);
        return content.units(lang, userId);
    }

    @GetMapping("/cards")
    public List<Dto.Card> cards(@PathVariable String lang) {
        requireLanguage(lang);
        return content.cards(lang);
    }

    @GetMapping("/lessons")
    public List<Dto.Lesson> lessons(@PathVariable String lang) {
        requireLanguage(lang);
        return content.lessons(lang);
    }

    @GetMapping("/quiz")
    public List<Dto.Question> quiz(@PathVariable String lang, @RequestParam(required = false) Long lesson) {
        requireLanguage(lang);
        return content.quiz(lang, lesson);
    }

    private void requireLanguage(String lang) {
        if (!content.languageExists(lang)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có ngôn ngữ: " + lang);
        }
    }
}
