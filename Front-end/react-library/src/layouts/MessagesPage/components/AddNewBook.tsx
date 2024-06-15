import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import {read} from "node:fs";
import AddBookRequest from "../../../Models/AddBookRequest";

export const AddNewBook = () => {

        const {authState} = useOktaAuth();

        const [author, setAuthor] = useState<string>('');
        const [title, setTitle] = useState<string>('');
        const [description, setDescription] = useState<string>('');
        const [copies, setCopies] = useState<number>(0);
        const [category, setCategory] = useState<string>('Category');
        const [selectedImg, setSelectedImg] = useState<any | null>(null);

        const [displayWarning, setDisplayWarning] = useState<boolean>(false);
        const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);


        function categoryField(value: string) {
            setCategory(value);
        }

        async function base64Conversion(e: any) {
            if (e.target.files[0]) {
                getBase64(e.target.files[0]);
            }
        }

        function getBase64(file: any) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                setSelectedImg(reader.result);
            }
            reader.onerror = function (error) {
                console.log('Error: ', error);
            }
        }

        async function submitNewBook() {
            const url = 'http://localhost:8080/api/admin/secure/add/book';
            if (authState?.isAuthenticated && author && title && description && copies > 0 && category !== 'Category') {
                const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
                book.img = selectedImg;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authState.accessToken?.accessToken
                    },
                    body: JSON.stringify(book)
                }
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Failed to add book');
                }
                setDisplaySuccess(true);
                setDisplayWarning(false);
                setAuthor('');
                setTitle('');
                setDescription('');
                setCopies(0);
                setCategory('Category');
                setSelectedImg(null);
            } else {
                setDisplayWarning(true);
                setDisplaySuccess(false);
            }
        }


        return (
            <div className={'container mt-5 mb-5'}>
                {displaySuccess && <div className={'alert alert-success'} role={'alert'}>
                    Book added successfully!
                </div>}
                {displayWarning && <div className={'alert alert-danger'} role={'alert'}>
                    All fields must be filled out!
                </div>}
                <div className={'card'}>
                    <div className={'card-header'}>
                        Add a new book
                    </div>
                    <div className={'card-body'}>
                        <form method={'POST'}>
                            <div className={'row'}>
                                <div className={'col-md-6 mb-3'}>
                                    <label className={'form-label'}>Title</label>
                                    <input type={'text'} className={'form-control'} name={'title'} required
                                           onChange={e => setTitle(e.target.value)}
                                           value={title}/>
                                </div>
                                <div className={'col-md-3 mb-3'}>
                                    <label className={'form-label'}>
                                        Author
                                    </label>
                                    <input type={'text'} className={'form-control'} name={'author'} required
                                           onChange={e => setAuthor(e.target.value)}
                                           value={author}/>
                                </div>
                                <div className={'col-md-3 mb-3'}>
                                    <label className={'form-label'}>
                                        Category
                                    </label>
                                    <button className={'form-control btn btn-secondary dropdown-toggle'} type={'button'}
                                            id={'dropdownMenuButton1'}
                                            data-bs-toggle={'dropdown'} aria-expanded={'false'}> {category} </button>
                                    <ul id={'addNewBookId'} className={'dropdown-menu'}
                                        aria-labelledby={'dropdownMenuButton1'}>
                                        <li><a onClick={() => categoryField('FE')} className={'dropdown-item'}>Front End</a>
                                        </li>
                                        <li><a onClick={() => categoryField('BE')} className={'dropdown-item'}>Back End</a>
                                        </li>
                                        <li><a onClick={() => categoryField('Data')} className={'dropdown-item'}>Data</a>
                                        </li>
                                        <li><a onClick={() => categoryField('DevOps')}
                                               className={'dropdown-item'}>DevOps</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={'col-md-12 mb-3'}>
                                <label className={'form-label'}>Description</label>
                                <textarea className={'form-control'} id={'exampleFormControlTextarea1'} rows={3}
                                          onChange={e => setDescription(e.target.value)}>
                        </textarea>
                            </div>
                            <div className={'col-md-3 mb-3'}>
                                <label className={'form-label'}>Copies</label>
                                <input type={'number'} className={'form-control'} name={'Copies'} required
                                       onChange={e => setCopies(parseInt(e.target.value))}
                                       value={copies}/>
                            </div>
                            <input type={'file'} onChange={e => base64Conversion(e)}/>
                            <div>
                                <button type={'button'} className={'btn btn-primary mt-3'} onClick={submitNewBook}>
                                    Add book
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
;