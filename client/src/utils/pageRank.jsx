export const calculatePageRank = (votesCount) => {
    const d = 0.85;
    const numCandidates = Object.keys(votesCount).length;

    let pageRank = {};
    for (const candidateId in votesCount) {
        pageRank[candidateId] = 1 / numCandidates;
    }

    for (let i = 0; i < 100; i++) {
        const newPageRank = {};
        for (const candidateId in votesCount) {
            newPageRank[candidateId] = (1 - d) / numCandidates;
            for (const [voter, votedFor] of Object.entries(votesCount)) {
                if (votedFor === candidateId) {
                    const numVotes = Object.values(votesCount).filter(v => v === votedFor).length;
                    newPageRank[candidateId] += (d * pageRank[voter]) / numVotes;
                }
            }
        }
        pageRank = newPageRank;
    }

    return pageRank;
};