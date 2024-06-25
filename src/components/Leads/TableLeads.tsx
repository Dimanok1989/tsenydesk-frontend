import { useAppSelector } from "@/stores/hooks";
import Card from "../Views/Card";
import { Dropdown, Icon, Table } from "semantic-ui-react";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";
import { FieldProps } from "@/stores/fields";

export type LeadResource = any;

export default function TableLeads() {

    const data = useAppSelector((state) => state.leads);

    return <Card>
        <Table basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>№ замера</Table.HeaderCell>
                    <Table.HeaderCell>Дата продажи</Table.HeaderCell>
                    <Table.HeaderCell>Дата поступления документов</Table.HeaderCell>
                    <Table.HeaderCell>Дата проверки</Table.HeaderCell>
                    <Table.HeaderCell>Дата выполненого перезамера</Table.HeaderCell>
                    <Table.HeaderCell>Дата запуска</Table.HeaderCell>
                    <Table.HeaderCell>Фамилия</Table.HeaderCell>
                    <Table.HeaderCell>Дата создания</Table.HeaderCell>
                    {(data.fields || []).map((field: FieldProps) => (
                        <Table.HeaderCell key={field.name}>{field.title}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.leads.map(i => <TableRow {...i} key={i.id} />)}
            </Table.Body>
        </Table>
    </Card>
}

/**
 * Карточка статуса
 * 
 * @param props 
 * @returns 
 */
export const StatusCard = (props: any) => <div className="flex items-center gap-3">
    {props.color && <span className="w-3 h-3 rounded" style={{ background: props.color }}></span>}
    <span>{props.name}</span>
</div>

const TableRow = (props: LeadResource) => {

    const router = useRouter();
    const fields = useAppSelector((state) => state.leads.fields);

    return <Table.Row className="cursor-default">
        <Table.Cell className="max-w-[27px]">
            <div className="px-3">
                <Dropdown
                    icon={null}
                    trigger={<span className="px-2"><Icon name="ellipsis vertical" link fitted /></span>}
                    options={[
                        { key: 'details', text: 'Детали', icon: "eye", onClick: () => router.push(`/leads/${props.id}`) },
                        // { key: 'complete', text: 'Завершить', icon: "check", disabled: true },
                        // { key: 'delete', text: 'Удалить', icon: "trash", disabled: true },
                    ]}
                />
            </div>
        </Table.Cell>
        {/* <Table.Cell>{props.status && <StatusCard {...props.status} />}</Table.Cell> */}
        <Table.Cell><Link href={`/leads/${props.id}`} className="text-blue-900">{props.number}</Link></Table.Cell>
        <Table.Cell>{props.date_sale && moment(props.date_sale).format("DD.MM.YYYY")}</Table.Cell>
        <Table.Cell>{props.date_sent_documents && moment(props.date_sent_documents).format("DD.MM.YYYY")}</Table.Cell>
        <Table.Cell>{props.date_inspection && moment(props.date_inspection).format("DD.MM.YYYY")}</Table.Cell>
        <Table.Cell>{props.date_remeasurement && moment(props.date_remeasurement).format("DD.MM.YYYY")}</Table.Cell>
        <Table.Cell>{props.date_start && moment(props.date_start).format("DD.MM.YYYY")}</Table.Cell>
        <Table.Cell>{props?.employee?.fullname}</Table.Cell>
        <Table.Cell>{props.created_at && moment(props.created_at).format("DD.MM.YYYY в HH:mm")}</Table.Cell>
        {fields.map((field: FieldProps) => <Table.Cell key={`${props.id}-${field.name}`}>
            {props[field.name] || null}
        </Table.Cell>)}
    </Table.Row>
}