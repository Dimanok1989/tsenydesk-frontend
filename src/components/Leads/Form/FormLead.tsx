import { Button, Checkbox, Form } from "semantic-ui-react";
import moment from "moment";
import { FieldProps } from "@/stores/fields";
import SelectMultiple from "@/components/Fields/Items/SelectMultiple";
import Select from "@/components/Fields/Items/Select";
import Number from "@/components/Fields/Items/Number";
import String from "@/components/Fields/Items/String";
import EmployeeField from "./EmployeeField";

interface FormLeadProps {
    loading: boolean;
    formdata: any;
    handleChange: (e: any, b: any) => any;
    statuses: any[];
    employees: any[];
    fields?: FieldProps[];
    errors?: any;
    inspections?: any[],
}

export default function FormLead(props: FormLeadProps) {

    const {
        loading,
        formdata,
        handleChange,
        statuses,
        employees,
        errors,
        fields,
        inspections,
    } = props;

    const remeasurement = typeof formdata?.inspection_types == "object"
        && typeof formdata?.inspection_types[2] == "boolean"
        && formdata.inspection_types[2] === false;

    const remeasurements = formdata?.remeasurements
        ? (formdata.remeasurements.length === 0 ? [{}] : formdata.remeasurements)
        : [{}];

    return <Form loading={loading}>

        <Form.Input
            label="Номер замера"
            placeholder="Введите номер замера"
            name="number"
            onChange={handleChange}
            value={formdata.number || ""}
            // disabled={loading}
            error={errors?.number}
            required
        />

        {/* <Form.Select
            label="Статус"
            placeholder="Выберите статус"
            options={statuses.map((i: any) => ({
                value: i.id,
                text: <div className="flex items-center gap-3">
                    {i.color && <span className="w-3 h-3 rounded" style={{ background: i.color }}></span>}
                    <span>{i.name}</span>
                </div>,
            }))}
            name="status_id"
            onChange={handleChange}
            value={formdata.status_id || ""}
            required
            // disabled={loading}
            error={errors?.status_id}
        /> */}

        <EmployeeField
            label="Сотрудник"
            name="employee_id"
            onChange={handleChange}
            value={formdata.employee_id || ""}
            // disabled={loading}
            error={errors?.employee_id}
            employees={employees || []}
        />

        <Form.Input
            label="Дата продажи"
            type="datetime-local"
            name="date_sale"
            onChange={(e, { name, value }) => {
                handleChange(e, { name, value });
                if (!Boolean(formdata?.date_sent_documents)) {
                    handleChange(e, {
                        name: "date_sent_documents",
                        value: moment(value).add(1, "days").format("YYYY-MM-DD")
                    });
                }
                if (!Boolean(formdata?.date_inspection)) {
                    handleChange(e, {
                        name: "date_inspection",
                        value: moment(value).add(2, "days").format("YYYY-MM-DD")
                    });
                }
            }}
            value={formdata.date_sale ? moment(formdata.date_sale).format("YYYY-MM-DD\THH:mm") : ""}
            // disabled={loading}
            error={errors?.date_sale}
        />

        <Form.Group widths='equal' className="!mb-2">
            <Form.Input
                label="Дата срока продажи"
                type="datetime-local"
                name="date_sale_term"
                onChange={(e, { name, value }) => {
                    handleChange(e, { name: "days_sale_term", value: null });
                    handleChange(e, { name, value });
                }}
                value={formdata.date_sale_term ? moment(formdata.date_sale_term).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_sale_term}
            />
            <Form.Input
                label="Срок продажи"
                placeholder="Количетсво дней"
                name="days_sale_term"
                type="number"
                min="0"
                step="1"
                onChange={(e, { name, value }) => {
                    handleChange(e, { name, value });
                    handleChange(e, {
                        name: "date_sale_term",
                        value: moment().add(value, "days").format("YYYY-MM-DD")
                    });
                }}
                value={formdata.days_sale_term || ""}
                // disabled={loading}
                error={errors?.days_sale_term}
            />
        </Form.Group>

        <small className="opacity-50">Введите дату со сроком продажи, либо укажите количество дней, в этом случае срок будет расчитан относительно сегодняшней даты</small>

        <Form.Group widths='equal' className="!mt-8">
            <Form.Input
                label="Дата ожидаемой подачи документов"
                type="datetime-local"
                name="date_sent_documents"
                onChange={handleChange}
                value={formdata?.date_sent_documents ? moment(formdata.date_sent_documents).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_sent_documents}
            />
            <Form.Input
                label="Факт. дата поступления док-ов"
                type="datetime-local"
                name="date_sent_documents_actual"
                onChange={handleChange}
                value={formdata?.date_sent_documents_actual ? moment(formdata.date_sent_documents_actual).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_sent_documents_actual}
            />
        </Form.Group>

        <Form.Group widths='equal'>
            <Form.Input
                label="Дата ожидаемой проверки"
                type="datetime-local"
                name="date_inspection"
                onChange={handleChange}
                value={formdata?.date_inspection ? moment(formdata.date_inspection).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_inspection}
            />
            <Form.Input
                label="Факт. дата проверки"
                type="datetime-local"
                name="date_inspection_actual"
                onChange={handleChange}
                value={formdata?.date_inspection_actual ? moment(formdata.date_inspection_actual).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_inspection_actual}
            />
        </Form.Group>

        <Form.Field className="!mb-5">
            <label className="!mb-3">Критерии проверки</label>
            {(inspections || []).map((e: any, key: number) => {
                return <div className="flex gap-3 items-center mb-2" key={key}>
                    <span className="cursor-default">{e.text}</span>
                    <Checkbox
                        radio
                        label="Да"
                        name={`inspection_types_${key}`}
                        className="!ms-3"
                        value={e.value}
                        checked={
                            typeof formdata?.inspection_types == "object"
                            && typeof formdata?.inspection_types[e.value] == "boolean"
                            && formdata.inspection_types[e.value] === true
                        }
                        onClick={(e, { value, checked }: any) => {
                            let inspectionTypes: any = formdata?.inspection_types || {};
                            inspectionTypes[value] = checked
                            handleChange(e, { name: 'inspection_types', value: inspectionTypes })
                        }}
                    />
                    <Checkbox
                        radio
                        label="Нет"
                        name={`inspection_types_${key}`}
                        className="!ms-3"
                        value={e.value}
                        checked={
                            typeof formdata?.inspection_types == "object"
                            && typeof formdata?.inspection_types[e.value] == "boolean"
                            && formdata.inspection_types[e.value] === false
                        }
                        onClick={(e, { value, checked }: any) => {
                            let inspectionTypes: any = formdata?.inspection_types || {};
                            inspectionTypes[value] = !checked
                            handleChange(e, { name: 'inspection_types', value: inspectionTypes })
                        }}
                    />
                    <Checkbox
                        radio
                        label="Не выбрано"
                        name={`inspection_types_${key}`}
                        className="!ms-3"
                        value={e.value}
                        checked={
                            typeof formdata?.inspection_types == "object"
                            && (
                                formdata?.inspection_types[e.value] === null
                                || formdata?.inspection_types[e.value] === undefined
                            )
                        }
                        onClick={(e, { value }: any) => {
                            let inspectionTypes: any = formdata?.inspection_types || {};
                            inspectionTypes[value] = null;
                            handleChange(e, { name: 'inspection_types', value: inspectionTypes })
                        }}
                    />
                </div>
            })}
        </Form.Field>

        <div className={`mb-3 ${remeasurement ? '' : '!hidden'}`}>

            <hr className="my-5" />

            {remeasurements.map((i: any, k: number) => {
                return <Form.Group widths='equal' key={k} className="!mb-1">
                    <Form.Input
                        label={k === 0 ? "Дата перезамера" : ""}
                        type="datetime-local"
                        onChange={(e, { value }) => {
                            let data = remeasurements;
                            data[k].date = value;
                            handleChange(e, { name: "remeasurements", value: data });
                        }}
                        value={i.date ? moment(i.date).format("YYYY-MM-DD\THH:mm") : ""}
                    // disabled={loading}
                    />
                    <Form.Input
                        label={k === 0 ? "Факт. дата перезамера" : ""}
                        type="datetime-local"
                        onChange={(e, { value }) => {
                            let data = remeasurements;
                            data[k].date_actual = value;
                            handleChange(e, { name: "remeasurements", value: data });
                        }}
                        value={i.date_actual ? moment(i.date_actual).format("YYYY-MM-DD\THH:mm") : ""}
                    />
                    <EmployeeField
                        label={k === 0 ? "Сотурдник" : null}
                        onChange={(e, { value }) => {
                            let data = remeasurements;
                            data[k].employee_id = value;
                            handleChange(e, { name: "remeasurements", value: data });
                        }}
                        value={i.employee_id || ""}
                        employees={employees || []}
                        notWithAdd
                    />
                    <Form.Input
                        label={k === 0 ? "Комментарий" : ""}
                        onChange={(e, { value }) => {
                            let data = remeasurements;
                            data[k].comment = value;
                            handleChange(e, { name: "remeasurements", value: data });
                        }}
                        value={i.comment || ""}
                    />
                    {((k + 1) === (remeasurements).length) && <Button
                        icon="plus"
                        basic
                        className={`${k === 0 ? "!mt-[17px]" : "!mt-[4px]"} !mb-[1px]`}
                        color="green"
                        title="Добавить ещё перезамер"
                        onClick={e => {
                            let data = remeasurements;
                            data[k + 1] = {};
                            handleChange(e, { name: "remeasurements", value: data });
                        }}
                    />}
                </Form.Group>
            })}
            <hr className="my-5" />
        </div>

        <Form.Group widths='equal'>
            <Form.Input
                label="Дата запуска"
                type="datetime-local"
                name="date_start"
                onChange={handleChange}
                value={formdata.date_start ? moment(formdata.date_start).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_start}
            />
            <Form.Input
                label="Факт. дата запуска"
                type="datetime-local"
                name="date_start_actual"
                onChange={handleChange}
                value={formdata.date_start_actual ? moment(formdata.date_start_actual).format("YYYY-MM-DD\THH:mm") : ""}
                // disabled={loading}
                error={errors?.date_start_actual}
            />
        </Form.Group>

        {(fields || []).map((field: FieldProps) => {

            let Item: any = null;
            let props: any = {
                label: field.title,
                placeholder: field.placeholder,
                name: field.name,
                value: formdata[field.name] || "",
            }

            switch (field.typeKey) {
                case "input": Item = String; break;
                case "number": Item = Number; break;
                case "select": Item = Select; break;
                case "select_multiple": Item = SelectMultiple; break;
            }

            if (field.typeKey === "select" || field.typeKey === "select_multiple") {
                props.options = (field.options || []).map((i: string, k: number) => ({
                    key: k,
                    text: i,
                    value: i,
                }));
            }

            return Item && <Item
                {...props}
                key={field.id}
                onChange={handleChange}
            // disabled={loading}
            />
        })}

    </Form>
}