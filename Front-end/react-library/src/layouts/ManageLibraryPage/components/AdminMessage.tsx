import MessageModel from "../../../Models/MessageModel";
import {useState} from "react";

export const AdminMessage: React.FC<{ message: MessageModel, submitResponse: any }> = (props, key) => {
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [response, setResponse] = useState<string>('');

    function submitBtn() {
        if (props.message.id && response) {
            props.submitResponse(props.message.id, response);
            setResponse('');
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div key={props.message.id}>
            <div className={'card mt-2 shadow p-3 bg-body rounded'}>
                <h5>Case #{props.message.id}: {props.message.title}</h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr/>

                <div>
                    <h5>Response:</h5>
                    <form action="PUT">
                        {displayWarning &&
                            <div className={'alert alert-danger'} role={'alert'}>
                                All fields must be filled out!
                            </div>
                        }

                        <div className={'col-md-12 mb-3'}>
                            <label className={'form-label'}>
                                Description
                            </label>
                            <textarea className={'form-control'} id={'exampleFormControlTextarea1'}
                                      rows={3} onChange={e => setResponse(e.target.value)} value={response}
                            />
                        </div>
                        <div>
                            <button type={'button'} className={'btn btn-primary'} onClick={submitBtn}>Send response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}