import Content from "@/components/Content";
import LeadFeed from "@/components/Leads/LeadFeed";
import EditLead from "@/components/Leads/Modals/EditLead";
import { StatusCard } from "@/components/Leads/TableLeads";
import Card from "@/components/Views/Card";
import { axios, getError } from "@/hooks/useAxios";
import { FieldProps } from "@/stores/fields";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setLead } from "@/stores/leads";
import moment from "moment";
import { useParams } from "next/navigation";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Button, Feed, Form, Header, Icon, Input, Label } from "semantic-ui-react";
import { InputFile } from "semantic-ui-react-input-file";

const ItemValue = (props: any) => <div className="flex items-center p-2 rounded cursor-default hover:bg-slate-50">
    <div className="min-w-[50%] mr-3"><strong>{props.text}</strong></div>
    <div>{props.value}</div>
</div>

export default function Leads() {

    const params = useParams();

    const [loading, setLoading] = useState<boolean>(true);
    const [fields, setFields] = useState<FieldProps[]>([]);
    const [edit, setEdit] = useState<null | number>(null);
    const [error, setError] = useState<null | string>(null);

    const lead = useAppSelector((state) => state.leads.lead);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setLoading(true);
        axios.get(`/leads/${params.lead}`)
            .then(({ data }) => {
                setFields(data.fields || []);
                dispatch(setLead(data));
                setError(null);
            })
            .catch(e => {
                setError(getError(e));
            })
            .then(() => {
                setLoading(false);
            });

        return () => {
            setError(null);
            dispatch(setLead({}));
        }
    }, []);

    return <Content
        loading={loading}
        error={error}
    >
        <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">
                <Header
                    as="h1"
                    content={`Замер ${lead?.number}`}
                    subheader={(lead?.name && lead.name !== lead.number) && lead.number}
                />
                <div>
                    <Icon
                        name="pencil"
                        link
                        fitted
                        title="Изменить заявку"
                        onClick={() => setEdit(lead?.id || null)}
                    />
                    <EditLead
                        leadId={edit}
                        close={() => setEdit(null)}
                    />
                </div>
            </div>

            <Card>
                <Header as="h3">Основные данные</Header>
                <ItemValue
                    text="Номер замера"
                    value={lead?.number}
                />
                <ItemValue
                    text="Срок продажи"
                    value={lead?.date_sale_term ? <span>
                        {moment(lead.date_sale_term).format("DD.MM.YYYY HH:mm")}
                        {(moment().format("X") < moment(lead.date_sale_term).format("X")) && <span className="opacity-60 pl-4">
                            через {moment(lead.date_sale_term).diff(moment(), "days")} дн.
                        </span>}
                    </span> : "---"}
                />
                <ItemValue
                    text="Дата продажи"
                    value={lead?.date_sale ? moment(lead.date_sale).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Дата ожидаемой подачи документов"
                    value={lead?.date_sent_documents ? moment(lead.date_sent_documents).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Фактическая дата поступления документов"
                    value={lead?.date_sent_documents_actual ? moment(lead.date_sent_documents_actual).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Дата ожидаемой проверки"
                    value={lead?.date_inspection ? moment(lead.date_inspection).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Фактическая дата проверки"
                    value={lead?.date_inspection_actual ? moment(lead.date_inspection_actual).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Критерии проверки"
                    value={<div className="flex gap-3">
                        {(lead?.inspections || []).map((item: any, key: number) => <Label key={key} color={item?.color || "orange"}>
                            {String(`${item?.title || ""} ${item?.value || ""}`).trim()}
                        </Label>)}
                    </div>}
                />
                <ItemValue
                    text="Ориентировочная дата запуска"
                    value={lead?.date_start ? moment(lead.date_start).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Фактическая дата запуска"
                    value={lead?.date_start_actual ? moment(lead.date_start_actual).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Сотрудник"
                    value={lead?.employee?.fullname || "---"}
                />
                <ItemValue
                    text="Перезамеры"
                    value={(lead?.remeasurements || []).length}
                />
                {fields.map((field: FieldProps) => <ItemValue
                    key={field.id}
                    text={field.title}
                    value={typeof lead == "object" ? lead[field.name] : null}
                />)}
                <hr className="my-2" />
                <ItemValue
                    text="Даата предварительного монтажа"
                    value={lead?.dismantling_date ? moment(lead.dismantling_date).format("DD.MM.YYYY HH:mm") : "---"}
                />
                <ItemValue
                    text="Сотрудник дкмонтажа"
                    value={lead?.dismantling_employee?.fullname || "---"}
                />
                <ItemValue
                    text="Комментарий демонтажа"
                    value={<i>{lead?.dismantling_comment || "---"}</i>}
                />
            </Card>

            {(lead?.remeasurements || []).length > 0 && <Card>
                <Header as="h3">Перезамеры</Header>
                {lead.remeasurements.map((item: any, key: number) => <div key={key}>
                    <ItemValue
                        text="Ожидаемая дата перезамера"
                        value={item?.date ? moment(item.date).format("DD.MM.YYYY HH:mm") : "---"}
                    />
                    <ItemValue
                        text="Фактическая дата перезамера"
                        value={item?.date_actual ? moment(item.date_actual).format("DD.MM.YYYY HH:mm") : "---"}
                    />
                    <ItemValue
                        text="Сотрудник"
                        value={item?.employee?.fullname || "---"}
                    />
                    <ItemValue
                        text="Комментарий"
                        value={<i>{item?.comment || "---"}</i>}
                    />
                    {(lead.remeasurements.length !== (key + 1)) && <hr className="my-2" />}
                </div>)}
            </Card>}

            <Card>
                <Header as="h3">Файлы</Header>
                <FileItem
                    title="Фото фасада"
                />
                <FileItem
                    title="Табличка дома"
                />
                <FileItem
                    title="Фото замерного листа"
                />
                <FileItem
                    title="Фото информ листа"
                />
                <FileItem
                    title="Фото договора"
                />
                <FileItem
                    title="Фото внутри объекта"
                />
            </Card>

            {(typeof lead?.feeds == "object" && lead?.feeds?.length > 0) && <Card>
                <Header as="h4">История изменений</Header>
                <Feed>
                    {lead.feeds.map((i: any) => <LeadFeed key={i.id} data={i} />)}
                </Feed>
            </Card>}
        </div>
    </Content>
}

function FileItem(props: any) {

    const [loading, setLoading] = useState(false);
    const handleUpload = useCallback(() => {
        setLoading(true);
    }, []);

    return <div className="mb-3">

        <Header as="h4" className="!mb-1">{props.title}</Header>

        <div className="flex-wrap gap-3">
            <InputFile
                button={{
                    icon: "plus",
                    basic: true,
                    size: "massive",
                    title: "Добавить новое фото",
                    label: null,
                    labelPosition: undefined,
                    loading: loading,
                    disabled: loading,
                }}
                input={{
                    id: 'input-control-id',
                    onChange: handleUpload
                }}
            />
        </div>
    </div>
}