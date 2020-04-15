import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ]
    transform(value: any) {
        value = String(value).toUpperCase()
        if (!this.isStatusValid(value)) {
            throw new BadRequestException("Invalid Status Passed")
        }
        return value
    }

    private isStatusValid(status: any) {
        return this.allowedStatuses.some((obj) => obj === status)
    }
}