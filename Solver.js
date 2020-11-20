/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2020 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

const freeSpace = {
	getTheFirstFreePoint(stringOfFreeCoordinates, initialPoint = {x: 0, y: 0}) {
		let result;

		for (let y = initialPoint.y; y < 18; y++) {
			for (let x = initialPoint.x; x < 18; x++) {
				result = stringOfFreeCoordinates.includes(`[${x},${y}]`)
				if (result) {
					result = {
						x,
						y
					}
					break
				}
			}
			if (result) break;
			initialPoint.x = 0;
		}

		return result;
	},

	getFreeSpaceForTheYellowShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, initialPoint) {
		const point = this.getTheFirstFreePoint(stringOfFreeCoordinates, initialPoint);
		const checkingThePlaceOnTheRight = this.checkIfThePointXOnTheRightIsFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point);

		if (checkingThePlaceOnTheRight) {
			return point;
		} 

		const newPoint = point.x < 17 ? {x: point.x + 1, y: point.y} : {x: 0, y: point.y + 1};

		return this.getFreeSpaceForTheYellowShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, newPoint);
	},

	getFreeSpaceForTheBlueShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, initialPoint) {
		const point = this.getTheFirstFreePoint(stringOfFreeCoordinates, initialPoint);
		const checkingThePlaceOnTheTop = this.checkIfThePointsXOnTheTopAreFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point);

		if (checkingThePlaceOnTheTop) {
			return point;
		} 



		const newPoint = point.x < 17 ? {x: point.x + 1, y: point.y} : {x: 0, y: point.y + 1};

		return this.getFreeSpaceForTheBlueShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, newPoint);
	},

	getFreeSpaceForTheCyanShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, initialPoint) {
		const point = this.getTheFirstFreePoint(stringOfFreeCoordinates, initialPoint);
		const checkingThePlaceOnTheRight = this.checkIfThePointXOnTheRightIsFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point);
		const checkingThePlaceOnTheTop = this.checkIfThePointsXOnTheTopAreFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point);
		const checkingThePlaceOnTheTopRight = this.checkIfThePointXOnTheTopRightIsFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point);
		const isRotate = !stringOfFreeCoordinates.includes(`[${coordinatesOfTheCurrentShape.x + 1},${coordinatesOfTheCurrentShape.y + 1}]`)

		if (checkingThePlaceOnTheRight) {
			return point;
		} 

		if (checkingThePlaceOnTheTop && checkingThePlaceOnTheTopRight) {
			if (isRotate) return {...point, needRotate: false, isRotated: true};

			return {...point, needRotate: true, isRotated: false};
		} 


		const newPoint = point.x < 17 ? {x: point.x + 1, y: point.y} : {x: 0, y: point.y + 1};

		return this.getFreeSpaceForTheYellowShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, newPoint);
	},

	checkIfThePointXOnTheRightIsFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point = {x: 0, y: 0}) {
		const rightPoint = `[${point.x + 1},${point.y}]`;
		const isPointFree = stringOfFreeCoordinates.includes(rightPoint);
		const checkingThePlaceOnTheTop = this.checkIfThePointsXOnTheTopAreFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, rightPoint);

		return isPointFree && checkingThePlaceOnTheTop;
	},

	checkIfThePointXOnTheTopRightIsFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point = {x: 0, y: 0}) {
		const topRightPoint = `[${point.x + 1},${point.y + 2}]`;
		const isPointFree = stringOfFreeCoordinates.includes(topRightPoint);
		const checkingThePlaceOnTheTop = this.checkIfThePointsXOnTheTopAreFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, topRightPoint);

		return isPointFree && checkingThePlaceOnTheTop;
	},

	checkIfThePointsXOnTheTopAreFree(stringOfFreeCoordinates, coordinatesOfTheCurrentShape, point) {
		let result = true;

		for ( let y = point.y; y < coordinatesOfTheCurrentShape.y - 2; y++) {
			result = stringOfFreeCoordinates.includes(`[${point.x},${y}]`)

			if (!result) break;
		}

		return result;
	},


}

var Solver = function (Direction, Element) {
    return {
        /**
         * @return next hero action
         */

        get: function (board) {

					const stringOfFreeCoordinates = board.getFreeSpace().toString();
					const coordinatesOfTheCurrentShape = {
						x: board.getCurrentFigurePosition().getX(),
						y: board.getCurrentFigurePosition().getY()
					};
					const currentShapeType = board.getCurrentFigureType();
					let freePointForShape;
					
					switch(currentShapeType) {
						case 'O': 
							freePointForShape = freeSpace.getFreeSpaceForTheYellowShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape);
							break;
						case 'J': 
							freePointForShape = freeSpace.getFreeSpaceForTheCyanShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape);

							if (freePointForShape.needRotate) {
								return Direction.ROTATE_180
							}

							if (!freePointForShape.isRotated) {
								coordinatesOfTheCurrentShape.x = coordinatesOfTheCurrentShape.x - 1;
							}

							break;
						case 'I': 	
							freePointForShape = freeSpace.getFreeSpaceForTheBlueShape(stringOfFreeCoordinates, coordinatesOfTheCurrentShape);
							break;
					}
					// Direction.ROTATE_180.combine(Direction.LEFT);
					if (freePointForShape.x < coordinatesOfTheCurrentShape.x) return Direction.LEFT;
					if (freePointForShape.x > coordinatesOfTheCurrentShape.x) return Direction.RIGHT;
					if (freePointForShape.x === coordinatesOfTheCurrentShape.x) return Direction.DOWN;

        }
    };
};

if (module) module.exports = Solver;
