import { isToday } from 'date-fns';

export enum GoalColor {
	red = 'red',
	orange = 'orange',
	yellow = 'yellow',
	green = 'green',
	blue = 'blue',
	purple = 'purple',
	gray = 'gray'
}

export type GoalBase = {
	id: string;
	slug: string; // Name
	title: string | null; // Description
	fineprint: string | null;
	baremin: string; // Minimum required amount due.
	safebump: number; // Total amount due.
	lastday: number; // Last day completed.
	losedate: number; // Midnight at the end of the last day possible.
	pledge: number; // Money paid on derailing.
	safebuf: number; // Days before beemergency.
	gunits: string; // Units of the goal (e.g., 'pages').
	runits: string; // Time unit for the goal (e.g., 'd', 'm').
};
// Properties that only exist on the API object.
export type GoalApi = GoalBase & {
	mathishard: number[];
	autoratchet: number; // Max number of buffer days.
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
	} else if (days >= 7 && days < 14) {
		return GoalColor.blue;
	} else if (days >= 14) {
		return GoalColor.purple;
	}
	return GoalColor.gray;
};

export const mostPressingColor = (goals: GoalClean[]) => {
	if (goals.length === 0) {
		return GoalColor.purple;
	}
	const lowestUncompletedGoal = goals.reduce((goal, nextGoal) => {
		if (!isDoneToday(nextGoal) && nextGoal.safebuf < goal.safebuf) {
			return nextGoal;
		}
		return goal;
	});
	return colorForBuffer(lowestUncompletedGoal.safebuf);
};
