import { isToday } from 'date-fns';

enum GoalColor {
	red = 'red',
	orange = 'orange',
	yellow = 'yellow',
	green = 'green',
	blue = 'blue',
	gray = 'gray'
}

export type GoalBase = {
	baremin: string;
	id: string;
	lastday: number;
	losedate: number;
	pledge: number;
	safebuf: number;
	safebump: number;
	slug: string;
	title: string;
	fineprint: string;
	runits: string;
	gunits: string;
};
// Properties that only exist on the API object.
export type GoalApi = GoalBase & {
	mathishard: number[];
	autoratchet: number;
	goal_type: string;
};
// Properties that only exist on the working object.
export type GoalClean = GoalBase & {
	rate: number;
	maxBuffer: number;
	goalType: string;
};

export const goalApiToGoalClean = (g: GoalApi) => {
	return {
		goalType: g.goal_type,
		maxBuffer: g.autoratchet,
		baremin: g.baremin,
		id: g.id,
		lastday: g.lastday,
		losedate: g.losedate,
		pledge: g.pledge,
		safebuf: g.safebuf,
		safebump: g.safebump,
		slug: g.slug,
		title: g.title,
		fineprint: g.fineprint,
		runits: g.runits,
		gunits: g.gunits,
		rate: g.mathishard[2]
	};
};

export const isDoneToday = (goal: GoalClean) => {
	return isToday(new Date(goal.lastday * 1000)) && goal.safebuf > 0;
};

export enum GroupByOption {
	ungrouped = 'ungrouped',
	done = 'done'
}
export type GoalsGroupedDefault = {
	goals: GoalClean[];
};
export type GoalsGroupedByDone = {
	notDone: GoalClean[];
	done: GoalClean[];
};
export type GoalGroup = GoalsGroupedDefault | GoalsGroupedByDone;

export const groupGoals = (goals: GoalClean[], option: GroupByOption) => {
	if (option === GroupByOption.done) {
		return goals.reduce(
			(acc, goal) => {
				if (isDoneToday(goal)) {
					return { notDone: [...acc.notDone], done: [...acc.done, goal] };
				}
				return { notDone: [...acc.notDone, goal], done: [...acc.done] };
			},
			{ notDone: [] as GoalClean[], done: [] as GoalClean[] }
		);
	}
	return {
		goals
	};
};

export const colorForBuffer = (days: number): GoalColor => {
	if (days === 0) {
		return GoalColor.red;
	} else if (days === 1) {
		return GoalColor.orange;
	} else if (days === 2) {
		return GoalColor.yellow;
	} else if (days >= 3 && days < 7) {
		return GoalColor.green;
	} else if (days >= 7) {
		return GoalColor.blue;
	}
	return GoalColor.gray;
};

export const mostPressingColor = (goals: GoalClean[]) => {
	if (goals.length === 0) {
		return GoalColor.blue;
	}
	const lowestUncompletedGoal = goals.reduce((goal, nextGoal) => {
		if (!isDoneToday(nextGoal) && nextGoal.safebuf < goal.safebuf) {
			return nextGoal;
		}
		return goal;
	});
	return colorForBuffer(lowestUncompletedGoal.safebuf);
};
