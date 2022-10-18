export function AutoUnsub() {
    return function (constructor) {
        constructor.prototype.ngOnDestroy = function () {
            // tslint:disable-next-line:forin
            for (const prop in this) {
                const property = this[prop];
                if (typeof property.subscribe === 'function') {
                    property.unsubscribe();
                }
            }
        };
        constructor.prototype.ngOnDestroy.apply();
    };
}
