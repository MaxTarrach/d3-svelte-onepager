<script>
  // Guessing game: slide to a percentage, check it against the real answer.
  // Feedback only has two states here (correct vs. too high) because the
  // question is one-directional — the real share is always the low end of
  // the range, so "too low" never comes up.
  export let answerValue = 0.58; // percent
  export let answerYear = 2022;
  export let correctMax = 1; // guesses at or below this count as correct
  export let min = 0;
  export let max = 100;

  let guess = 50;
  let feedback = null; // null | "correct" | "high"
  let attempts = 0;

  function checkGuess() {
    attempts += 1;
    feedback = guess <= correctMax ? "correct" : "high";
  }

  function onSlide() {
    feedback = null;
  }
</script>

<div class="quiz">
  <p class="prompt">
    What share of Palau's total final energy consumption came from
    <strong>renewable sources</strong> in {answerYear}? Slide to your guess,
    then check it.
  </p>

  <div class="control">
    <input
      class="slider"
      type="range"
      {min}
      {max}
      step="1"
      bind:value={guess}
      on:input={onSlide}
      aria-label="Guess, in percent"
    />
    <span class="guess-value">{guess}%</span>
  </div>

  <button class="check-btn" on:click={checkGuess}>Check my guess</button>

  <div class="feedback-slot" aria-live="polite">
    {#if feedback === "correct"}
      <p class="feedback feedback-correct">
        Correct — renewable sources made up just
        <strong class="value-hi">{answerValue}%</strong> of Palau's total final energy
        consumption in {answerYear}.
      </p>
    {:else if feedback === "high"}
      <p class="feedback feedback-high">
        That's too high — the real share is lower. Try again.
      </p>
    {/if}
  </div>

  {#if attempts > 0}
    <p class="attempts">
      {attempts}
      {attempts === 1 ? "attempt" : "attempts"}
    </p>
  {/if}
</div>

<style>
  .quiz {
    max-width: 32em;
  }

  .prompt {
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--ink);
  }

  .control {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .slider {
    flex: 1;
    accent-color: var(--magenta);
  }

  .guess-value {
    flex: 0 0 3.5rem;
    text-align: right;
    font-size: 1.1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums lining-nums;
    color: var(--ink);
  }

  .check-btn {
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--field);
    background: var(--ink);
    border: none;
    border-radius: var(--radius);
    padding: 0.55rem 1.25rem;
    cursor: pointer;
  }

  .check-btn:hover {
    opacity: 0.85;
  }

  .feedback-slot {
    min-height: 1.5em;
    margin-top: 1rem;
  }

  .feedback {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .feedback-correct {
    color: var(--ink);
  }

  .value-hi {
    color: var(--magenta-ink);
  }

  .feedback-high {
    color: var(--ink-muted);
  }

  .attempts {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--ink-muted);
  }
</style>
