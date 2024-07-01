import { Checkbox, Form } from "semantic-ui-react";
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

    return <Form>

        <Form.Input
            label="Номер замера"
            placeholder="Введите номер замера"
            name="number"
            onChange={handleChange}
            value={formdata.number || ""}
            disabled={loading}
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
            disabled={loading}
            error={errors?.status_id}
        /> */}

        <EmployeeField
            name="employee_id"
            onChange={handleChange}
            value={formdata.employee_id || ""}
            disabled={loading}
            error={errors?.employee_id}
            employees={employees || []}
        />

        <Form.Input
            label="Дата продажи"
            type="date"
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
            value={formdata.date_sale ? moment(formdata.date_sale).format("YYYY-MM-DD") : ""}
            disabled={loading}
            error={errors?.date_sale}
        />

        <Form.Group widths='equal' className="!mb-2">
            <Form.Input
                label="Дата срока продажи"
                type="date"
                name="date_sale_term"
                onChange={(e, { name, value }) => {
                    handleChange(e, { name: "days_sale_term", value: null });
                    handleChange(e, { name, value });
                }}
                value={formdata.date_sale_term ? moment(formdata.date_sale_term).format("YYYY-MM-DD") : ""}
                disabled={loading}
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
                disabled={loading}
                error={errors?.days_sale_term}
            />
        </Form.Group>

        <small className="opacity-50">Введите дату со сроком продажи, либо укажите количество дней, в этом случае срок будет расчитан относительно сегодняшней даты</small>

        <Form.Group widths='equal' className="!mt-8">
            <Form.Input
                label="Дата ожидаемой подачи документов"
                type="date"
                name="date_sent_documents"
                onChange={handleChange}
                value={formdata?.date_sent_documents ? moment(formdata.date_sent_documents).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_sent_documents}
            />
            <Form.Input
                label="Факт. дата поступления док-ов"
                type="date"
                name="date_sent_documents_actual"
                onChange={handleChange}
                value={formdata?.date_sent_documents_actual ? moment(formdata.date_sent_documents_actual).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_sent_documents_actual}
            />
        </Form.Group>

        <Form.Group widths='equal'>
            <Form.Input
                label="Дата ожидаемой проверки"
                type="date"
                name="date_inspection"
                onChange={handleChange}
                value={formdata?.date_inspection ? moment(formdata.date_inspection).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_inspection}
            />
            <Form.Input
                label="Факт. дата проверки"
                type="date"
                name="date_inspection_actual"
                onChange={handleChange}
                value={formdata?.date_inspection_actual ? moment(formdata.date_inspection_actual).format("YYYY-MM-DD") : ""}
                disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
            })}
        </Form.Field>

        <Form.Group widths='equal' className={`${remeasurement ? '' : '!hidden'}`}>
            <Form.Input
                label="Дата выполненого перезамера"
                type="date"
                name="date_remeasurement"
                onChange={handleChange}
                value={formdata.date_remeasurement ? moment(formdata.date_remeasurement).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_remeasurement}
            />
            <Form.Input
                label="Факт. дата перезамера"
                type="date"
                name="date_remeasurement_actual"
                onChange={handleChange}
                value={formdata.date_remeasurement_actual ? moment(formdata.date_remeasurement_actual).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_remeasurement_actual}
            />
        </Form.Group>

        <Form.Group widths='equal'>
            <Form.Input
                label="Дата запуска"
                type="date"
                name="date_start"
                onChange={handleChange}
                value={formdata.date_start ? moment(formdata.date_start).format("YYYY-MM-DD") : ""}
                disabled={loading}
                error={errors?.date_start}
            />
            <Form.Input
                label="Факт. дата запуска"
                type="date"
                name="date_start_actual"
                onChange={handleChange}
                value={formdata.date_start_actual ? moment(formdata.date_start_actual).format("YYYY-MM-DD") : ""}
                disabled={loading}
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
                disabled={loading}
            />
        })}

    </Form>
}