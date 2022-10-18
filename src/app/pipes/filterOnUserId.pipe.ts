import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterOnUserId'})
export class FilterOnUserIdPipe implements PipeTransform {
    transform(list: any[], acceptedId: string) {
        console.log(list, acceptedId)
        if (list) {
            return list.filter(item => item.uid == acceptedId);
        }
    }
}
