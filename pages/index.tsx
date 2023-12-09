// pages/index.tsx
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource';
import { Button, Card, Flex, Grid, Heading, Input, Label } from '@aws-amplify/ui-react';


// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default function HomePage() {
  const [todos, setTodos] = useState<Schema['Todo'][]>([]);
  const [order, setOrder] = useState<string>();

  async function listTodos() {
    // fetch all todos
    const { data } = await client.models.Todo.list();
    setTodos(data);
  }

  useEffect(() => {

    const sub = client.models.Todo.observeQuery().subscribe(({ items }) => setTodos([...items]))
    //return () => sub.unsubscribe()
  
  }, []);

  const handleSubmit = async () => {

    // create a new Todo with the following attributes
    const { errors, data: newTodo } = await client.models.Todo.create({

      // prompt the user to enter the title

      content: order,

      done: false,

      priority: 'medium'

    })

    console.log(errors, newTodo);

  };

  return (
  <Grid
    columnGap="0.5rem"
    rowGap="0.5rem"
    templateColumns="1fr 1fr 1fr"
    templateRows="1fr 9fr 1fr"
    color="black"
  >
    <Card
      columnStart="1"
      columnEnd="-1"
    >
      <Heading level={1} textAlign={'center'}>Sophie Burguer 🍔</Heading>
    </Card>
    <Card
      columnStart="1"
      columnEnd="2"
    >
      <Flex direction="column" gap="small">
        <Heading level={2} textAlign={'center'}> Menú</Heading>
        <Input id="order" type="text" isRequired onChange={e => setOrder(e.currentTarget.value)}/>
        <Button type="button" onClick={handleSubmit}>Enviar pedido</Button>
      </Flex>
      
    </Card>
    <Card
      columnStart="2"
      columnEnd="-1"
    >
      <Heading level={2} textAlign={'center'}> Pedidos activos</Heading>
    
      <Flex direction={'column'} maxWidth={'400px'}>
        {todos.map((todo) => (
          <Card variation="outlined" key={todo.id}>{todo.content}</Card>
        ))}
      </Flex>
      
    </Card>
  </Grid>
    
  );
}
