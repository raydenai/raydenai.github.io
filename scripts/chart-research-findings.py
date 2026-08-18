#!/usr/bin/env python3
"""Render the AURA research frequency chart from the audit summary.

The values are documented internal observations from the 30-site research
corpus, not universal industry benchmarks. Output is committed as a supporting
visual inside docs/assets/.
"""
from pathlib import Path
import matplotlib.pyplot as plt

patterns = [
    ("Hero: identity + CTA", 93),
    ("Social proof", 93),
    ("Book / product artifact", 93),
    ("Lead magnet", 80),
    ("Numeric credibility", 70),
    ("Named methodology", 67),
    ("Origin story", 67),
    ("Manifesto / beliefs", 63),
    ("Problem agitation", 57),
    ("Content / blog grid", 53),
]
labels = [p[0] for p in patterns][::-1]
values = [p[1] for p in patterns][::-1]

plt.style.use("dark_background")
fig, ax = plt.subplots(figsize=(12, 7), dpi=160)
fig.patch.set_facecolor("#0b0b0d")
ax.set_facecolor("#0b0b0d")
colors = ["#c9a24a" if value >= 80 else "#746c5a" for value in values]
bars = ax.barh(labels, values, color=colors, height=0.62)
ax.set_xlim(0, 100)
ax.set_xlabel("Observed frequency across 30-site corpus (%)", color="#c8c2b5", labelpad=12)
ax.tick_params(colors="#e6e0d4", labelsize=10)
ax.xaxis.grid(True, color="#2a2824", linewidth=0.8)
ax.set_axisbelow(True)
for spine in ax.spines.values():
    spine.set_visible(False)
for bar, value in zip(bars, values):
    ax.text(value + 1.3, bar.get_y() + bar.get_height() / 2, f"{value}%", va="center", color="#f1eadc", fontsize=10, weight="bold")
ax.set_title("Personal-brand authority mechanisms most frequently observed", color="#f3eee3", loc="left", fontsize=16, weight="bold", pad=20)
ax.text(0, -1.35, "AURA research synthesis — counts describe the audited InfluEx-led corpus, not a general population.", color="#a7a095", fontsize=9)
plt.tight_layout()
out = Path("docs/assets/research-frequency.png")
out.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(out, bbox_inches="tight", facecolor=fig.get_facecolor())
print(out)
