import { registry } from '@web/core/registry';

const datetimepickerDefaultValueService = {
    start() {
        const values = {
            defaultTime: null,
            defaultStartTime: null,
            defaultEndTime: null,
        };

        return {
            init(defaultTime, defaultStartTime, defaultEndTime) {
                values.defaultTime = defaultTime;
                values.defaultStartTime = defaultStartTime;
                values.defaultEndTime = defaultEndTime;
            },

            get() {
                return values;
            },
        };
    },
};

registry.category("services").add("datetimepicker_defaultValue", datetimepickerDefaultValueService);
