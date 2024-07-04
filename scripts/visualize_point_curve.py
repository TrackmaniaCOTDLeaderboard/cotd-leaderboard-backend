import matplotlib.pyplot as plt
import numpy as np


def point_distribution(max_awarded_players, max_points, min_points):
    def get_points(position):
        points = min_points + (max_points - min_points) * (
            1 - np.log10(position) / np.log10(max_awarded_players)
        )
        return points

    return get_points


# Different styles for overlapping scenarios
styles = {
    "Time Attack": {"color": "blue", "linestyle": "-"},
    "Main Cup": {"color": "red", "linestyle": "-"},
    "Rerun Cup": {"color": "green", "linestyle": "-"},
    "Main Challenge": {"color": "orange", "linestyle": "-"},
    "Rerun Challenge": {"color": "purple", "linestyle": "-"},
}

def draw(scenarios):
    plt.figure(figsize=(12, 8))
    name = []

    max_points_total = 0
    max_awarded_players_total = 0

    for label, max_awarded_players, max_points, min_points in scenarios:
        get_points = point_distribution(max_awarded_players, max_points, min_points)
        positions = np.arange(1, max_awarded_players + 1)
        points = [get_points(pos) for pos in positions]
        plt.plot(positions, points, **styles[label], label=label)
        name.append(label)
        max_points_total = max(max_points_total, max_points)
        max_awarded_players_total = max(max_awarded_players, max_awarded_players_total)

    title_name = " & ".join(name)
    # Highlight the overlap by adjusting the plot properties
    plt.xlabel("Position")
    plt.ylabel("Points")
    plt.title(
        f"Points Distribution for {title_name} "
    )
    plt.legend()
    plt.grid(True)
    

    plt.xlim(1, 640)
    plt.ylim(0, 1000)

    file_name = "-".join(name)
    
    plt.savefig(f"./images/points_distribution_comparison_{file_name}.jpg")
    plt.close()

draw([("Time Attack", 256, 1000, 1)])
draw([("Main Cup", 640, 1000, 1),("Rerun Cup", 128, 200, 1)])
draw([("Main Challenge", 640, 1000, 1),("Rerun Challenge", 128, 200, 1)])

