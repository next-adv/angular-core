import {Pipe, PipeTransform} from '@angular/core';
import {ICompetition} from '../../../shared/interfaces/competition.interfaces';
import * as moment from 'moment';
import * as _ from 'underscore';

@Pipe({
    name: 'nxtDate'
})
export class DatePipe implements PipeTransform {

    transform(value: ICompetition[] = [], ...args: any[]): any {
        if (_.isNull(value)) {
            return;
        }

        if (args[0] === 'last_week') {
            const val = this.getLastWeekData(value);
            if (val.length === 0) {
                return null;
            }
            return val;
        }
        if (args[0] === 'last_month') {
            const val = this.getLastMonthData(value);
            if (val.length === 0) {
                return null;
            }
            return val;
        }
        if (args[0] === 'last_month_wo_week') {
            const val = this.getLastMonthWOWeekData(value);
            if (val.length === 0) {
                return null;
            }
            return val;
        }
        if (args[0] === 'range') {
            return this.getRangeData(value, args[1], args[2]);
        }
        if (typeof args[0] === 'object') {
            return this.getThisDateData(value, args[0]);
        }
    }

    getThisDateData(data: ICompetition[], date1: Date): any {
        const date = moment(date1);
        return data.filter(elem => {
            const compDate = moment(elem.dates[0]);
            return compDate.isSame(date, 'day');
        });
    }

    getRangeData(data: ICompetition[], date1: Date, date2: Date): any {
        const dateFrom = moment(date1);
        const dateTo = moment(date2);
        return data.filter(elem => {
            const compDate = moment(elem.dates[0]);
            return compDate.isSameOrAfter(dateFrom, 'day') && compDate.isSameOrBefore(dateTo, 'day');
        });
    }

    getLastWeekData(data: ICompetition[]): any {
        const startTime = moment().subtract(7, 'd');
        return data.filter(elem => {
            const compDate = moment(elem.dates[0]);
            return compDate.isSameOrAfter(startTime);
        });
    }

    getLastMonthData(data: ICompetition[]): any {
        const startTime = moment().month();
        return data.filter(elem => {
            const compDate = moment(elem.dates[0]);
            return compDate.month() === startTime;
        });
    }

    getLastMonthWOWeekData(data: ICompetition[]): any {
        const startTime = moment().month();
        const weekTime = moment().subtract(7, 'd');

        return data.filter(elem => {
            const compDate = moment(elem.dates[0]);
            return compDate.month() === startTime && compDate.isBefore(weekTime);
        });
    }

}
