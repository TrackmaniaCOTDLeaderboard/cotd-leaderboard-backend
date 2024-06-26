import numpy as np
import matplotlib.pyplot as plt

# Number of participants in the original tournament
n_original = 640

# Number of participants in the adjusted tournament
n_adjusted = int(n_original * 0.2)
max_adjusted_points = 200
num_points_awarded = 128

# Ranks for both tournaments
ranks_original = np.arange(1, n_original + 1)
ranks_adjusted = np.arange(1, num_points_awarded + 1)


# Points distribution functions
def points_logarithmic(r, n, max_points):
    min_points = 1
    return min_points + (max_points - min_points) * (1 - np.log10(r) / np.log10(n))


# Calculate the points for each rank in both tournaments
points_original = points_logarithmic(ranks_original, n_original, 1000)
points_adjusted = points_logarithmic(
    ranks_adjusted, num_points_awarded, max_adjusted_points
)

# Plot the functions
plt.figure(figsize=(10, 6))

# Plot original points distribution
plt.plot(
    ranks_original,
    points_original,
    label="Original Points Distribution (Main (Top1000))",
    color="blue",
)

# Plot adjusted points distribution
plt.plot(
    ranks_adjusted,
    points_adjusted,
    label="Adjusted Points Distribution (Reruns (Top200))",
    color="red",
)

# Labels and title
plt.xlabel("Rank")
plt.ylabel("Points")
plt.title(
    r"Points Distribution Comparison: $1 + (max - 1) \times \left(1 - \frac{\log_{10}(r)}{\log_{10}(n)}\right)$"
)
plt.legend()
plt.grid(True)

# Save the plot as a JPG file
plt.savefig("points_distribution_comparison.jpg", format="jpg")

# Display the plot
plt.show()
