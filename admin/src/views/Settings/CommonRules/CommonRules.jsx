import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, FormGroup, Input, Label, CustomInput, Button } from 'reactstrap'

import Heading from '../component/Heading'

function CommonRulesContent () {
  return (
    <main className="main-content d-flex">
      <section>
        <Heading buttonText="Add Common Rule" heading="Common Rule Management" permission setUrl="/settings/add-common-rule"/>
        <Row className='mt-4'>
          <Col lg="6">
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>Register Bonus</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="minValue">Min Value</Label>
                    <Input id="minValue" placeholder="Enter Minimum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="maxValue">Max Value</Label>
                    <Input id="maxValue" placeholder="Enter Maximum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="expiryDays">Expiry Days</Label>
                    <Input id="expiryDays" placeholder="Enter Expiry Days" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">Register Bonus Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>Register Refer</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="minValue">Min Value</Label>
                    <Input id="minValue" placeholder="Enter Minimum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="maxValue">Max Value</Label>
                    <Input id="maxValue" placeholder="Enter Maximum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="expiryDays">Expiry Days</Label>
                    <Input id="expiryDays" placeholder="Enter Expiry Days" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">Register Refer Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>Private League Commission</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount(%)</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">Private League Commission Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="6">
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>Register Code Bonus</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="minValue">Min Value</Label>
                    <Input id="minValue" placeholder="Enter Minimum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="maxValue">Max Value</Label>
                    <Input id="maxValue" placeholder="Enter Maximum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="expiryDays">Expiry Days</Label>
                    <Input id="expiryDays" placeholder="Enter Expiry Days" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">Register Code Bonus Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>Deposit Bonus</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="minValue">Min Value</Label>
                    <Input id="minValue" placeholder="Enter Minimum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="maxValue">Max Value</Label>
                    <Input id="maxValue" placeholder="Enter Maximum Value" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="expiryDays">Expiry Days</Label>
                    <Input id="expiryDays" placeholder="Enter Expiry Days" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">Deposit Bonus Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="common-box">
              <div className="d-flex justify-content-between align-items-start">
                <h3>League Creator Commission</h3>
                <Button color="link">Edit</Button>
              </div>
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="amount">Amount(%)</Label>
                    <Input id="amount" placeholder="Enter Amount" type="text" />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="type">Type</Label>
                    <CustomInput className="form-control" name="type" type="select">
                      <option>Select Type</option>
                      <option>Bonus</option>
                      <option>Cash</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup className="d-flex justify-content-between mb-0">
                    <Label for="status">League Creator Commission Active?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput id="registerRadio1" label="Yes" name="registerRadio" type="radio" />
                      <CustomInput id="registerRadio2" label="No" name="registerRadio" type="radio" />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </section>
    </main>
  )
}

export default connect()(CommonRulesContent)
