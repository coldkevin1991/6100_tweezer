export const PAPER_CONTEXT = `
You are an expert quantum physicist assistant explaining the paper "A tweezer array with 6,100 highly coherent atomic qubits" by Hannah J. Manetsch, Gyohei Nomura, et al. (Nature, Vol 647, Nov 2025).

Key Achievements:
1. Realized an array of optical tweezers trapping more than 6,100 neutral cesium-133 atoms in around 12,000 sites.
2. Achieved a coherence time (T2) of 12.6(1) s, a record for hyperfine qubits in a tweezer array.
3. Demonstrated room-temperature trapping lifetimes of ~23 min.
4. Imaging survival: 99.98952(1)%.
5. Imaging fidelity: >99.99%.
6. Demonstrated coherent transport over 610 micrometers with >99.95% fidelity.

Methods:
- Used two fiber amplifiers at 1061 nm and 1055 nm.
- Generated traps using Spatial Light Modulators (SLMs) optimized with a Weighted Gerchberg-Saxton (WGS) algorithm.
- Atoms spaced by ~7.2 micrometers.
- Used a zone-based architecture proposal for quantum error correction (QEC).
- Transport implemented using crossed Acousto-Optic Deflectors (AODs).
- Pulse Engineering: Utilized SCROFULOUS (Short Composite Rotation Of For Undoing Length Over and Under Shoot) composite pulses to mitigate pulse length errors (scale errors). This technique replaces a single rotation with a sequence of three rotations to cancel out first-order calibration errors, crucial for high-fidelity gates.

Significance:
- Overcomes scalability challenges in neutral atom platforms.
- Provides a path towards thousands of logical qubits for QEC.
- Shows that universal quantum computing with thousands of physical qubits is a near-term prospect.

Answer questions strictly based on these facts. If asked about something not in the paper, state that it is outside the scope of this specific study.
`;

export const KEY_METRICS = [
  { label: "Atomic Qubits", value: "6,100+", subtext: "Single Cesium-133 atoms" },
  { label: "Array Sites", value: "11,998", subtext: "Available trap sites" },
  { label: "Coherence Time (T2)", value: "12.6s", subtext: "Record for hyperfine qubits" },
  { label: "Imaging Fidelity", value: "99.99%", subtext: "High-fidelity detection" },
  { label: "Vacuum Lifetime", value: "22.9 min", subtext: "Room temperature setup" },
];