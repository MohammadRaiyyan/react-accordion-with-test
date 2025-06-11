import Accordion from "./components/Accordion";


function App() {
  return (
    <div className="App">
      <Accordion.Root defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div>
              <h2>This is item 1</h2>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
              quam aspernatur explicabo quas? Corporis, minima? Nam, facilis
              voluptates voluptatum nostrum facere laboriosam magnam. Eos vero
              omnis repellendus sequi beatae minus aspernatur modi explicabo
              cupiditate. Voluptas, impedit natus reprehenderit illum, at
              sapiente repellendus tempore expedita libero beatae architecto
              dolore quam quidem.
            </p>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <h2>This is item 2</h2>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
              quam aspernatur explicabo quas? Corporis, minima? Nam, facilis
              voluptates voluptatum nostrum facere laboriosam magnam. Eos vero
              omnis repellendus sequi beatae minus aspernatur modi explicabo
              cupiditate. Voluptas, impedit natus reprehenderit illum, at
              sapiente repellendus tempore expedita libero beatae architecto
              dolore quam quidem.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}

export default App;
