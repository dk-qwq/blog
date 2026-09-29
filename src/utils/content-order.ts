export type RankableItem = {
	pinWeight?: number;
	published: Date;
};

export function contentCompareFn(
	a: RankableItem,
	b: RankableItem,
	onlySortedByDate = false,
): number {
	if (!onlySortedByDate) {
		const weightDifference = (b.pinWeight ?? 2) - (a.pinWeight ?? 2);
		if (weightDifference) return weightDifference;
	}
	return new Date(b.published).getTime() - new Date(a.published).getTime();
}
