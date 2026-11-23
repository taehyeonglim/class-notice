"""Synthesize the trailer score. Usage: python3 make-score.py /tmp/score.wav."""

import math
import struct
import sys
import wave

RATE = 32_000
BEAT = 0.6
DURATION = 59.95
CHORDS = [(60, 64, 67, 71), (57, 60, 64, 67), (53, 57, 60, 64), (55, 59, 62, 69)]


def synthesize():
    track = [0.0] * round(RATE * DURATION)

    def note(time, midi, volume, decay, bright):
        frequency = 440 * 2 ** ((midi - 69) / 12)
        start = round(time * RATE)
        omega = math.tau * frequency / RATE
        for index in range(min(round(decay * RATE * 4), len(track) - start)):
            seconds = index / RATE
            envelope = min(seconds / 0.015, 1) * math.exp(-seconds / decay)
            tone = math.sin(omega * index) + bright * math.sin(2 * omega * index)
            track[start + index] += volume * envelope * tone

    for bar in range(25):
        start = bar * 4 * BEAT
        chord = CHORDS[bar % len(CHORDS)]
        note(start, chord[0] - 12, 0.087, 0.52, 0.12)
        note(start + 2 * BEAT, chord[2] - 12, 0.058, 0.46, 0.08)
        for beat, degree in enumerate((0, 2, 1, 3, 2, 1)):
            note(start + beat * BEAT * 2 / 3, chord[degree] + 12, 0.032, 0.22, 0.24)
        for degree in (0, 1, 2):
            note(start, chord[degree], 0.024, 0.7, 0.12)
        if 4 <= bar <= 22:
            note(start + BEAT, chord[2] + 24, 0.014, 0.11, 0.28)
            note(start + 3 * BEAT, chord[1] + 24, 0.012, 0.11, 0.28)

    with wave.open(sys.argv[1], 'wb') as audio:
        audio.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        samples = bytearray()
        for index, value in enumerate(track):
            time = index / RATE
            fade = min(1, time / 0.32, (DURATION - time) / 1.6)
            samples += struct.pack('<h', round(32767 * value * fade * 2.8))
        audio.writeframes(samples)


if __name__ == '__main__':
    synthesize()
