import matplotlib.pyplot as plt
import numpy as np


def point_distribution(max_awarded_players, max_points, min_points):
    def get_points(position):
        points = min_points + (max_points - min_points) * (
            1 - np.log10(position) / np.log10(max_awarded_players)
        )
        return round(points)

    return get_points


scenarios = [
    ("Time Attack", 256, 1000, 1),
    ("Cup", 640, 1000, 1),
    ("Cup Rerun", 128, 200, 1),
    ("Challenge", 640, 1000, 1),
    ("Challenge Rerun", 128, 200, 1),
]

plt.figure(figsize=(12, 8))

# Different styles for overlapping scenarios
styles = {
    "Time Attack": {"color": "blue", "linestyle": "-"},
    "Cup": {"color": "red", "linestyle": "-"},
    "Cup Rerun": {"color": "green", "linestyle": "-"},
    "Challenge": {"color": "orange", "linestyle": "--"},
    "Challenge Rerun": {"color": "purple", "linestyle": "--"},
}

for label, max_awarded_players, max_points, min_points in scenarios:
    get_points = point_distribution(max_awarded_players, max_points, min_points)
    positions = np.arange(1, max_awarded_players + 1)
    points = [get_points(pos) for pos in positions]
    plt.step(positions, points, where="mid", **styles[label], label=label)

# Highlight the overlap by adjusting the plot properties
plt.xlabel("Position")
plt.ylabel("Points")
plt.title(
    r"Points Distribution Comparison: $1 + (max - 1) \times \left(1 - \frac{\log_{10}(r)}{\log_{10}(n)}\right)$"
)
plt.legend()
plt.grid(True)

plt.savefig("./points_distribution_comparison.jpg")
