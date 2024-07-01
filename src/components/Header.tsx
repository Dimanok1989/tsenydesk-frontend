import { useApp } from "@/hooks/useApp";
import { useRouter } from "next/router";
import { Dropdown, Icon, Image } from "semantic-ui-react";

export default function Header() {

    const app: any = useApp();
    const router = useRouter();

    return <div className="h-[4rem] px-5 fixed top-0 left-0 right-0 flex gap-2 items-center bg-white ">

        <div className="flex items-center gap-2 grow" onClick={() => router.push("/")}>
            <Image src="/favicon.ico" className="w-[2.5rem] h-[2.5rem] rounded" />
            <div className="font-sans text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME || "Tsenydesk"}</div>
        </div>

        {app?.data?.profile && <div className="flex items-center gap-2">
            <div><Image src={app.data.profile.avatar} circular size="mini" /></div>
            <div>{app.data.profile.name}</div>
        </div>}

        <div className="md:hidden">
            <Dropdown icon="bars" className="ms-5" direction="left">
                <Dropdown.Menu>
                    {(app?.data?.menu || []) && app.data.menu.map((item: any, key: number) => <Dropdown.Item
                        key={key}
                        onClick={() => item?.route && router.push(item.route)}
                        active={
                            router.pathname === item?.route
                            || router.pathname.indexOf(item?.route) === 0
                        }
                    >
                        {item?.icon && <Icon name={item.icon} />}
                        <span className="text">{item?.name}</span>
                    </Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </div>

    </div >
}