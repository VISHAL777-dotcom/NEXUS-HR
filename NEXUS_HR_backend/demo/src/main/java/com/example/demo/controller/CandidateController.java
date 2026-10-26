package com.example.demo.controller;

import com.example.demo.Model.CandidateModel;
import com.example.demo.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping
    public ResponseEntity<List<CandidateModel>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateModel> getCandidateById(@PathVariable Integer id) {
        return ResponseEntity.ok(candidateService.getCandidateById(id));
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<CandidateModel>> getCandidatesByStage(@PathVariable CandidateModel.Stage stage) {
        return ResponseEntity.ok(candidateService.getCandidatesByStage(stage));
    }

    @PostMapping
    public ResponseEntity<CandidateModel> createCandidate(@RequestBody CandidateModel candidate) {
        return new ResponseEntity<>(candidateService.createCandidate(candidate), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<CandidateModel> moveStage(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        CandidateModel.Stage stage = CandidateModel.Stage.valueOf(body.get("stage"));
        return ResponseEntity.ok(candidateService.moveStage(id, stage));
    }

    @PatchMapping("/{id}/ai-score")
    public ResponseEntity<CandidateModel> updateAiScore(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(candidateService.updateAiScore(id, body.get("score")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Integer id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}
