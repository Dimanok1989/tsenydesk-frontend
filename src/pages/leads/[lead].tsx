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
import { useEffect, useState } from "react";
import { Feed, Header, Icon, Label } from "semantic-ui-react";

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
                <ItemValue
                    text="Номер замера"
                    value={lead?.number}
                />
                <ItemValue
                    text="Срок продажи"
                    value={lead?.date_sale_term && <span>
                        {moment(lead.date_sale_term).format("DD.MM.YYYY")}
                        {(moment().format("X") < moment(lead.date_sale_term).format("X")) && <span className="opacity-60 pl-4">
                            через {moment(lead.date_sale_term).diff(moment(), "days")} дн.
                        </span>}
                    </span>}
                />
                <ItemValue
                    text="Дата продажи"
                    value={lead?.date_sale && moment(lead.date_sale).format("DD.MM.YYYY")}
                />
                <ItemValue
                    text="Ориентировочная дата поступления документов"
                    value={lead?.date_sent_documents ? moment(lead.date_sent_documents).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Фактическая дата поступления документов"
                    value={lead?.date_sent_documents_actual ? moment(lead.date_sent_documents_actual).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Ориентировочная дата проверки"
                    value={lead?.date_inspection ? moment(lead.date_inspection).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Фактическая дата проверки"
                    value={lead?.date_inspection_actual ? moment(lead.date_inspection_actual).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Критерии проверки"
                    value={<div className="flex gap-3">
                        {(lead?.inspections || []).map((item: string, key: number) => <Label key={key} color="orange">
                            {item}
                        </Label>)}
                    </div>}
                />
                <ItemValue
                    text="Ориентировочная дата выполненого перезамера"
                    value={lead?.date_remeasurement ? moment(lead.date_remeasurement).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Фактическая дата выполненого перезамера"
                    value={lead?.date_remeasurement_actual ? moment(lead.date_remeasurement_actual).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Ориентировочная дата запуска"
                    value={lead?.date_start ? moment(lead.date_start).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Фактическая дата запуска"
                    value={lead?.date_start_actual ? moment(lead.date_start_actual).format("DD.MM.YYYY") : "---"}
                />
                <ItemValue
                    text="Сотрудник"
                    value={lead?.employee?.fullname || "---"}
                />
                {fields.map((field: FieldProps) => <ItemValue
                    key={field.id}
                    text={field.title}
                    value={typeof lead == "object" ? lead[field.name] : null}
                />)}
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