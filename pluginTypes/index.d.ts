/// <amd-module name="@scom/scom-blog/interface.ts" />
declare module "@scom/scom-blog/interface.ts" {
    import { IconName, IDataSchema, IUISchema } from "@ijstech/components";
    export interface PageBlock {
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        validate?: () => boolean;
        defaultEdit?: boolean;
        tag?: any;
        readonly onEdit: () => Promise<void>;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
        config: () => Promise<void>;
    }
    export interface IConfig {
        title: string;
        backgroundImage: string;
        description?: string;
        linkUrl?: string;
        date?: string;
        userName?: string;
        avatar?: string;
        isExternal?: boolean;
    }
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IPageBlockAction {
        name?: string;
        icon?: IconName;
        command?: (builder: any, userInputData: any) => ICommand;
        userInputDataSchema?: IDataSchema;
        userInputUISchema?: IUISchema;
    }
}
/// <amd-module name="@scom/scom-blog/index.css.ts" />
declare module "@scom/scom-blog/index.css.ts" {
    export const cardStyle: string;
    export const cardItemStyle: string;
    export const imageStyle: string;
    export const imageOverlayStyle: string;
    export const avatarStyle: string;
    export const controlStyle: string;
    export const containerStyle: string;
}
/// <amd-module name="@scom/scom-blog/data.json.ts" />
declare module "@scom/scom-blog/data.json.ts" {
    const _default: {
        defaultBuilderData: {
            title: string;
            description: string;
            backgroundImage: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-blog" />
declare module "@scom/scom-blog" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { IConfig, IPageBlockAction } from "@scom/scom-blog/interface.ts";
    interface ScomBlogElement extends ControlElement {
        lazyLoad?: boolean;
        data?: IConfig;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-blog']: ScomBlogElement;
            }
        }
    }
    export default class Blog extends Module {
        private pnlCardBody;
        private _data;
        tag: any;
        defaultEdit: boolean;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        readonly onEdit: () => Promise<void>;
        static create(options?: ScomBlogElement, parent?: Container): Promise<Blog>;
        constructor(parent?: Container, options?: ScomBlogElement);
        init(): void;
        private getData;
        private setData;
        private getTag;
        private setTag;
        private _getActions;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => IPageBlockAction[];
            getData: any;
            setData: (data: IConfig) => Promise<void>;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private onUpdateBlock;
        private formatDate;
        private openLink;
        render(): any;
    }
}
