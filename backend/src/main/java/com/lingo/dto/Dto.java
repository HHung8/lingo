package com.lingo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Tên trường khớp đúng với kiểu dữ liệu của frontend (frontend/src/types.ts). */
public final class Dto {
    private Dto() {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Unit(String j, String t, String s, String st, Integer p) {}
    public record Card(long id, String front, String meaning, String reading, String ex, String tr) {}
    public record Question(String q, List<String> a, int c, String e) {}
    public record Lesson(long id, String title, String unit) {}

    public record RegisterRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(max = 80) String displayName) {}
    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(String token, String email, String displayName) {}

    public record AttemptRequest(@NotNull Long lessonId, @Min(0) int score, @Min(1) int total) {}
    public record ReviewRequest(boolean known) {}
    public record StudyRequest(@NotBlank String lang, @Min(1) @Max(600) int minutes) {}
    public record Summary(int streakDays, int minutesToday, int dailyGoalMinutes) {}
}
