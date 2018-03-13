import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/jquery/dist/jquery.slim.min.js';
import '../node_modules/popper.js/dist/umd/popper.min.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            items: [],
            orderByAsc: true,
            showAll: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        const value = this.state.value;
        if (value !== '') {
            const elements = this.state.items.slice();
            elements.push({
                task: value,
                completed: false,
                createdAt: Date.now(),
                show: true
            });
            this.setState({items: elements, value: ''});
        }
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    // Fetch
    componentWillMount(){
        if(localStorage.getItem('elements'))
            this.setState({items: JSON.parse(localStorage.getItem('elements'))});
        if(localStorage.getItem('orderByAsc'))
            this.setState({orderByAsc: localStorage.getItem('orderByAsc')});
        if(localStorage.getItem('showAll'))
            this.setState({showAll: localStorage.getItem('showAll')});
    }

    // Storage
    componentWillUpdate(nextProps, nextState){
        localStorage.setItem('elements', JSON.stringify(nextState.items));
    }

    // Remove tasks
    deleteTask(item){
        const newState = JSON.parse(localStorage.getItem('elements'));
        const key = newState.map(function(e) { return e.createdAt; }).indexOf(item.createdAt);
        if (key > -1) {
            newState.splice(key, 1);
            localStorage.setItem('elements', JSON.stringify(newState));
            this.setState({items: JSON.parse(localStorage.getItem('elements'))});
        }
    }

    // Complete and Incomplete tasks
    toggleTask(item){
        const newState = JSON.parse(localStorage.getItem('elements'));
        const key = newState.map(function(e) { return e.createdAt; }).indexOf(item.createdAt);
        if (key > -1) {
            newState[key].completed = !newState[key].completed;
            localStorage.setItem('elements', JSON.stringify(newState));
            this.setState({items: JSON.parse(localStorage.getItem('elements'))});
        }
    }

    toggleOrderBy(orderByAsc){
        const newState = JSON.parse(localStorage.getItem('elements'));
        newState.sort(function(a,b) {
            if(orderByAsc)
                return b.createdAt < a.createdAt;
            else
                return a.createdAt < b.createdAt;
        });
        localStorage.setItem('orderByAsc', orderByAsc);
        this.setState({orderByAsc: localStorage.getItem('orderByAsc')});
        localStorage.setItem('elements', JSON.stringify(newState));
        this.setState({items: JSON.parse(localStorage.getItem('elements'))});
    }

    toggleShow(showAll) {
        const newState = JSON.parse(localStorage.getItem('elements'));
        newState.map(function(e){
            if(!showAll && !e.completed)
                e.show = false;
            else
                e.show = true;
        });
        localStorage.setItem('showAll', showAll);
        this.setState({showAll: localStorage.getItem('showAll')});
        localStorage.setItem('elements', JSON.stringify(newState));
        this.setState({items: JSON.parse(localStorage.getItem('elements'))});
    }

    render() {
        return (
            <div className="container mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="bg-primary rounded text-center text-white">To Do List</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="input-group">
                                    <input autoFocus type="text" value={this.state.value} className='form-control'
                                           placeholder='New task...' onChange={this.handleChange}/>
                                </div>
                            </div>
                            <button type="submit" className='d-none'/>
                        </form>
                        <table className="table table-hover table-sm">
                            <thead>
                            <tr>
                                <th scope="col">Task</th>
                                <th scope="col" className='w-25 text-center'>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.items.map(item =>
                                    <tr key={item.createdAt} className={(item.completed ? "table-active" : "table-default") +
                                            (item.show ? " d-table-row" : " d-none")}>
                                        <td className={"align-middle pl-3" + (item.completed ? " text-muted" : "")}>
                                            {(item.completed ? <s>{item.task}</s> : item.task)}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <button type="button"
                                                    className={"mr-2 btn-toggle btn btn-sm btn-" + (item.completed ? "warning" : "success")}
                                                    title={(item.completed ? "Incomplete" : "Complete")}
                                                    onClick={this.toggleTask.bind(this, item)}
                                            >{(item.completed ? "Incomplete" : "Complete")}
                                            </button>
                                            <button type="button"
                                                    className="btn btn-sm btn-danger"
                                                    title="Delete"
                                                    onClick={this.deleteTask.bind(this, item)}
                                            >Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 text-center">
                        <h5>Order by date</h5>
                        <button type="button"
                                className="btn btn-sm mr-2"
                                title="Ascending"
                                // disabled={this.state.orderByAsc}
                                onClick={this.toggleOrderBy.bind(this, true)}
                        >Ascending
                        </button>
                        <button type="button"
                                className="btn btn-sm"
                                title="Descending"
                                // disabled={!this.state.orderByAsc}
                                onClick={this.toggleOrderBy.bind(this, false)}
                        >Descending
                        </button>
                    </div>
                    <div className="col-md-6 text-center">
                        <h5>Show</h5>
                        <button type="button"
                                className="btn btn-sm mr-2"
                                title="All"
                                // disabled={this.state.orderByAsc}
                                onClick={this.toggleShow.bind(this, true)}
                        >All
                        </button>
                        <button type="button"
                                className="btn btn-sm"
                                title="Completed"
                                // disabled={this.state.orderByAsc}
                                onClick={this.toggleShow.bind(this, false)}
                        >Completed
                        </button>
                    </div>

                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);