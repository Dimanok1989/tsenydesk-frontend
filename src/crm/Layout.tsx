import React from "react";
import { AppConsumer, CrmProvider } from "./Provider";
import { Loader } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Login from "@/components/Auth/Login";
import Dashboard from "./Dashboard";

interface CrmLayoutProps {
    children: React.ReactNode;
}

export function CrmLayout({ children }: CrmLayoutProps) {
    return (
        <CrmProvider>
            <AppConsumer>
                {app => app.loading
                    ? <div className="h-screen w-screen flex items-center">
                        <Loader active />
                    </div>
                    : (app.isLogin ? <Dashboard>{children}</Dashboard> : <Login render />)
                }
            </AppConsumer>
        </CrmProvider>
    );
}