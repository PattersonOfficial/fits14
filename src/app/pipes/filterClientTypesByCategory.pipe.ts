import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterOnUserId'})
export class FilterClientTypesByCategoryPipe implements PipeTransform {
    transform(list: any[], acceptedId: string) {
        if (list) {
            return list.filter(item => item.category_id === acceptedId);
        }
    }
}
