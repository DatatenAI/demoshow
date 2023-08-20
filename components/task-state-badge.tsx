import React, {FC} from 'react';
import type {TaskState} from "@prisma/client";
import {BiLoaderAlt} from "@react-icons/all-files/bi/BiLoaderAlt";
import {Badge} from "@/ui/badge";
import {AiOutlineCheck} from "@react-icons/all-files/ai/AiOutlineCheck";
import {MdError} from "@react-icons/all-files/md/MdError";

const TaskStateBadge: FC<{
    state: TaskState
}> = props => {
    switch (props.state) {
        case 'RUNNING':
            return <Badge variant={'info'} plain>
                <BiLoaderAlt className={'animate-spin mr-1'}/>
                运行中
            </Badge>
        case 'SUCCESS':
            return <Badge variant={"success"} plain>
                <AiOutlineCheck className={'mr-1'}/>
                成功
            </Badge>
        case 'FAIL':
            return <Badge variant={"destructive"} plain>
                <MdError className={'mr-1'}/>
                失败
            </Badge>
    }
};


export default TaskStateBadge;