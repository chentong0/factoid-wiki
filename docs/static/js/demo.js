

function DropDownTrigger({text}) {
    return (
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span className="is-clipped">{text}</span>
            <span className="icon is-small"><i className="fas fa-angle-down" aria-hidden="true"></i></span>
        </button>
    );
}

function DropDownMenuItem({text, active, onClick}) {
    let cls = "dropdown-item" + (active ? " is-active" : "");
    return (
        <a className={cls} onClick={onClick}>{text}</a>
    );
}
function DropDownMenu({list}) {
    return list.map((item, idx) => 
        <DropDownMenuItem key={idx} text={item.text} active={item.active} onClick={item.onClick} />
    );
}

function ButtonGroupItem({text, active, onClick}) {
    let cls = "button" + (active ? " is-selected is-success" : "");
    // let text_display = active ? "Top-" + text : text;
    let text_display = text;
    return (
        <button className={cls} onClick={onClick}>{text_display}</button>
    );
    // <button className="button is-success is-selected">Top-1</button>
}
function ButtonGroup({list}) {
    return list.map((item, idx) => 
        <ButtonGroupItem key={idx} text={item.text} active={item.active} onClick={item.onClick} />
    );
}

function Box({title, content}) {
    return (
        <div className="box">
            <h5>{title}</h5>
            <div dangerouslySetInnerHTML={{__html: content}}></div>
        </div>
    );
}

function AppDemo({data}) {
    const [qid, setQid] = React.useState(0);  // question id 
    const [mid, setMid] = React.useState(0);  // model id
    const [tid, setTid] = React.useState(0);  // task id
    const [kid, setKid] = React.useState(0);  // top-k

    function getDropdownMenuList(list, idValue, setIDFunc) {
        return list.map((item, idx) => {
            return {
                text: item,
                active: idx == idValue,
                onClick: () => setIDFunc(idx),
            }
        })
    }
    function getContent(data, unitType, qid, mid, kid) {
        let qname = question_list[qid];
        let mname = model_list[mid];
        let tname = task_list[tid];
        // try if error return emtpy
        try {
            return data[qname][mname][tname][unitType];
        } catch (error) {
            return "";
        }
    }
    // console.log(data);
    let question_list = Object.keys(data);
    // console.log(question_list);
    let model_list = Object.keys(data[question_list[0]]);
    let task_list = Object.keys(data[question_list[0]][model_list[0]]);

    // let question_list = [
    //     "[NQ] What is the angle of the Tower of Pisa?",
    //     "[NQ] What is the best way to cook a steak?",
    //     "[NQ] What is the capital of France?",
    // ]
    // let model_list = [
    //     "GTR",
    //     "DPR",
    // ]
    // let data = {
    //     "[NQ] What is the angle of the Tower of Pisa?": {
    //         "GTR": {
    //             "passage": [
    //                 "Prior to restoration work performed between 1990 and 2001, the tower leaned at an angle of 5.5 degrees, but the tower now leans at about 3.99 degrees. This means the top of the Leaning Tower of Pisa is displaced horizontally 3.9 meters (12 ft 10 in) from the center.",
    //             ],
    //             "sentence": [
    //                 "Prior to restoration work performed between 1990 and 2001, the tower leaned at an angle of 5.5 degrees, but the tower now leans at about 3.99 degrees.",
    //             ],
    //             "proposition": [
    //                 "The Leaning Tower of Pisa now leans at about 3.99 degrees.",
    //             ],
    //         },
    //     }
    // }
    // data = {
    //     "<question": {
    //         "<model_1>": {
    //             "passage": ["<p1>", "<p2>", "<p3>"],
    //             "sentence": ["<s1>", "<s2>", "<s3>"],
    //             "proposition": ["<r1>", "<r2>", "<r3>"],
    //         },
    //         "<model_2>": {
    //         }
    //     }
    // }
    // <span style="display: inline-block; overflow: hidden;">[NQ] What is the angle of the Tower of Pisa?</span>
    // ss = "display: inline-block; overflow: hidden;"

    return (
        <div>
            <div className="columns">
                <div className="column is-three-quarters">
                    <div className="dropdown is-hoverable is-fullwidth">
                        <div className="dropdown-trigger">
                            <DropDownTrigger text={question_list[qid]} />
                        </div>
                        <div className="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                                <DropDownMenu list={getDropdownMenuList(question_list, qid, setQid)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column is-one-quarter">
                    <div className="dropdown is-hoverable is-fullwidth">
                        <div className="dropdown-trigger">
                            <DropDownTrigger text={model_list[mid]} />
                        </div>
                        <div className="dropdown-menu"role="menu">
                            <div className="dropdown-content">
                                <DropDownMenu list={getDropdownMenuList(model_list, mid, setMid)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <div className="buttons has-addons is-left">
                        <ButtonGroup list={getDropdownMenuList(["Show Top-1 Passage", "Show First 50 words"], tid, setTid)} />
                    </div>
                </div>
                {/* <div className="column">
                    <div className="buttons has-addons is-right">
                        <ButtonGroup list={getDropdownMenuList(["1", "2", "3"], kid, setKid)} />
                    </div>
                </div> */}
            </div>
            <Box title="Proposition Retrieval" content={getContent(data, "proposition", qid, mid, tid)} />
            <Box title="Sentence Retrieval" content={getContent(data, "sentence", qid, mid, tid)} />
            <Box title="Passage Retrieval" content={getContent(data, "passage", qid, mid, tid)} />
        </div>
    );
}


// function AppDemo() {
//     return <h1>Hello, world!</h1>;
// }

// console.log("Hello, world!");
// load /static/data/data.json to data waiting for rendering
let data = {};
fetch("static/data/data.json")
    .then(response => response.json())
    .then(json => {
        data = json;
        // console.log(data);
        console.log("data loaded");
    })
    .then(() => {
        const container = document.getElementById('app-demo');
        const root = ReactDOM.createRoot(container);
        root.render(<AppDemo data={data} />);
        console.log("rendered");
    })
// console.log("Hello, world!");