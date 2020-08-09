const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

export const DAYS = ['Mon', 'Wed', 'Fri']

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
MONTHS.unshift(...MONTHS.splice(new Date().getMonth() + 1))

export const getDay = () =>
	Math.floor(Date.now() / MILLISECONDS_IN_DAY)

export const getCurrentCount = () =>
	new Date().getDay() + 1

export const getFirstVisibleDay = () =>
	getDay() - ActivityNode.PAST_COUNT - getCurrentCount()

export default class ActivityNode {
	static PAST_COUNT = 52 * 4
	
	static isObserving = false
	
	date: Date
	
	constructor(public day: number, public value: number) {
		this.date = new Date(day * MILLISECONDS_IN_DAY)
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new ActivityNode(snapshot.get('day') ?? 0, snapshot.get('value') ?? 0)
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.value = snapshot.get('value')
		return this
	}
}
