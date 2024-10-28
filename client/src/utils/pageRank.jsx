export const calculatePageRank = (votesCount, maxIterations = 100, tolerance = 1e-6) => {
    const d = 0.85;
    const numCandidates = Object.keys(votesCount).length;

    let pageRank = {};
    let outDegree = {};

    for (const candidateId in votesCount) {
        pageRank[candidateId] = 1 / numCandidates;
        outDegree[candidateId] = Object.values(votesCount).filter(v => v === candidateId).length || 1;
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        let delta = 0;
        const newPageRank = {};

        for (const candidateId in votesCount) {
            let rankSum = 0;

            for (const [voter, votedFor] of Object.entries(votesCount)) {
                if (votedFor === candidateId) {
                    rankSum += pageRank[voter] / outDegree[voter];
                }
            }

            newPageRank[candidateId] = (1 - d) / numCandidates + d * rankSum;

            delta += Math.abs(newPageRank[candidateId] - pageRank[candidateId]);
        }

        pageRank = newPageRank;

        if (delta < tolerance) break;
    }

    return pageRank;
};
