import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class PipeStatus implements PipeTransform {
    readonly methodStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value) {
        value = value.toUpperCase()
        if(!this.isSatusValid(value)) {
            throw new BadRequestException(`This status is not found`)
        }
        return value

    }

    private isSatusValid(value) {
        const idx = this.methodStatus.indexOf(value)
        return idx !== -1
    }
}