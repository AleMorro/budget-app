import Form from 'react-bootstrap/Form';
import '../styles/TestRBoot.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function TestRBoot() {
  return (
   <div class="d-block p-2 bg-primary text-white">
      <Form className='form-example'>
         <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
         </Form.Group>
         <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
         </Form.Group>
      </Form>
   </div>
  );
}

export default TestRBoot;