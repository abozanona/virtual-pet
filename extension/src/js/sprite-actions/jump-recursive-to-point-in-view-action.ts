import { EdgeDetector, Point2d } from "../edge-detector";
import { SpriteEngine } from "../sprite-engine";
import { store } from "../store";
import { ActionPriority, SpriteAction } from "./sprite-action";

export class jumpRecursiveToPointInViewAction extends SpriteAction {
	public priority: ActionPriority = ActionPriority.ACTION_JUMP_RECURSIVE_TO_POINT_IN_VIEW;
	public minExecutionTime: number = 60;
	public maxExecutionTime: number = 60;

	private destinationVisiblePoint: Point2d = this.getVisiblePoint();

	public selectionPrecondition() {
		return !SpriteEngine.gameStatus.sprite.isSleeping && !this.isSpriteInviewPort();
	}
	public async start() {
		while (!this.isCanceled && !this.isSpriteInviewPort()) {
			if (!EdgeDetector.isPointInViewPort(this.destinationVisiblePoint)) {
				this.destinationVisiblePoint = this.getVisiblePoint();
			}
			await store.animationEngine.moveCloserToPoint(this.destinationVisiblePoint);
		}
		await this.cancel();
	}
	public async cancel() {
		super.cancel();
	}

	constructor() {
		super();
	}

	private getVisiblePoint(): Point2d {
		const visibleEdges = store.edgeDetector.horizontalVisibleEdges;
		const edge = visibleEdges[Math.floor(Math.random() * visibleEdges.length)];
		return edge.start;
	}

	private isSpriteInviewPort(): boolean {
		const spriteRect = document.querySelector("#vp-player-container")!.getBoundingClientRect();
		return EdgeDetector.isPointInViewPort({ x: spriteRect.x, y: spriteRect.y });
	}
}
