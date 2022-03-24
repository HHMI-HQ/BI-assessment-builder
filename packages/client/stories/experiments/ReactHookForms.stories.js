import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { range } from 'lodash'
import { datatype, name } from 'faker'

let counter = 1

const GridWrapper = styled.div`
  column-gap: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 20px;

  input[type='text'],
  input[type='tel'],
  input[type='email'],
  select {
    height: 40px;
    width: 100%;
  }

  .error {
    color: red;
  }
`

const Grid2 = styled.div`
  grid-column: span 2;
`

const Grid4 = styled.div`
  grid-column: span 4;
`

const makeOptions = n =>
  range(n).map(i => {
    return {
      label: name.findName(),
      value: datatype.uuid(),
    }
  })

const selectOptions = makeOptions(3)
const checkboxOptions = makeOptions(3)
const radioOptions = makeOptions(3)

export const ReactHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    // e.preventDefault()
    // console.log('data')
    // console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GridWrapper>
        {range(4).map(i => {
          return (
            <>
              <Grid4>
                <p>Section {i + 1}</p>
              </Grid4>
              <Grid2>
                <label htmlFor={`lastName${i}`}>
                  Last name
                  <input
                    id={`lastName${i}`}
                    type="text"
                    {...register(`lastName${i}`, { required: true })}
                  />
                </label>
                {errors[`lastName${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <div>
                <label htmlFor={`firstName${i}`}>
                  First name
                  <input
                    id={`firstName${i}`}
                    type="text"
                    {...register(`firstName${i}`, { required: true })}
                  />
                </label>
                {errors[`firstName${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </div>
              <div>
                <label htmlFor={`pronouns${i}`}>
                  Pronouns
                  <input
                    id={`pronouns${i}`}
                    type="text"
                    {...register(`pronouns${i}`, { required: true })}
                  />
                </label>
                {errors[`pronouns${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </div>
              <Grid2>
                <label htmlFor={`middleName${i}`}>
                  Middle name
                  <input
                    id={`middleName${i}`}
                    type="text"
                    {...register(`middleName${i}`, { required: true })}
                  />
                </label>
                {errors[`middleName${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <Grid2>
                <label htmlFor={`displayName${i}`}>
                  Display name
                  <input
                    id={`displayName${i}`}
                    type="text"
                    {...register(`displayName${i}`, { required: true })}
                  />
                </label>
                {errors[`displayName${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <Grid4>
                <label htmlFor={`option${i}`}>
                  Select an option
                  <select
                    id={`option${i}`}
                    {...register(`option${i}`, { required: true })}
                  >
                    <option>--</option>
                    {selectOptions.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </label>
                {errors[`option${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid4>
              <Grid2>
                <label htmlFor={`phone${i}`}>
                  Phone
                  <input
                    id={`phone${i}`}
                    pattern="[+]{1}[0-9]{11,14}"
                    type="tel"
                    {...register(`phone${i}`, { required: true })}
                  />
                </label>
                {errors[`phone${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <Grid2>
                <label htmlFor={`email${i}`}>
                  Email
                  <input
                    id={`email${i}`}
                    type="email"
                    {...register(`email${i}`, { required: true })}
                  />
                </label>
                {errors[`email${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <div>
                <p>Check at least one</p>
                {checkboxOptions.map(op => (
                  <p key={`${op.value}-${i}`}>
                    <label htmlFor={`${op.value}-${i}`}>
                      <input
                        id={`${op.value}-${i}`}
                        type="checkbox"
                        value={op.value}
                        {...register(`checkbox${i}`, { required: true })}
                      />{' '}
                      {op.label}
                    </label>
                  </p>
                ))}
                {errors[`checkbox${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </div>
              <div>
                Choose one
                {radioOptions.map(op => (
                  <p key={op.value}>
                    <label htmlFor={`${op.value}-${i}`}>
                      <input
                        id={`${op.value}-${i}`}
                        type="radio"
                        value={op.value}
                        {...register(`radio${i}`, { required: true })}
                      />{' '}
                      {op.label}
                    </label>
                  </p>
                ))}
                {errors[`radio${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </div>
              <Grid2>
                <textarea {...register(`text${i}`, { required: true })} />
                {errors[`text${i}`] && (
                  <span className="error">This field is required</span>
                )}
              </Grid2>
              <Grid4>
                <hr />
              </Grid4>
            </>
          )
        })}

        {/* 
        <Grid4>
          <hr />
          <p>Section 2</p>
        </Grid4>
        <Grid2>
          <label htmlFor="lastName2">
            Last name
            <input
              id="lastName2"
              type="text"
              {...register('lastName2', { required: true })}
            />
          </label>
          {errors.lastName2 && <span>This field is required</span>}
        </Grid2>
        <div>
          <label htmlFor="firstName2">
            First name
            <input
              id="firstName2"
              type="text"
              {...register('firstName2', { required: true })}
            />
          </label>
          {errors.firstName2 && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="pronouns">
            Pronouns
            <input
              id="pronouns"
              type="text"
              {...register('pronouns', { required: true })}
            />
          </label>
          {errors.pronouns && <span>This field is required</span>}
        </div>
        <Grid2>
          <label htmlFor="middleName">
            Middle name
            <input
              id="middleName"
              type="text"
              {...register('middleName', { required: true })}
            />
          </label>
          {errors.middleName && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="displayName">
            Display name
            <input
              id="displayName"
              type="text"
              {...register('displayName', { required: true })}
            />
          </label>
          {errors.displayName && <span>This field is required</span>}
        </Grid2>
        <Grid4>
          <label htmlFor="option">
            Select an option
            <select id="option" {...register('option', { required: true })}>
              <option>--</option>
              {selectOptions.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>
          {errors.option && <span>This field is required</span>}
        </Grid4>
        <Grid2>
          <label htmlFor="phone">
            Phone
            <input
              id="phone"
              pattern="[+]{1}[0-9]{11,14}"
              type="tel"
              {...register('phone', { required: true })}
            />
          </label>
          {errors.phone && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
            />
          </label>
          {errors.email && <span>This field is required</span>}
        </Grid2>
        <div>
          <p>Check at least one</p>
          {checkboxOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="checkbox"
                  value={op.value}
                  {...register('checkbox', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.checkbox && <span>This field is required</span>}
        </div>
        <div>
          Choose one
          {radioOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="radio"
                  value={op.value}
                  {...register('radio', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.radio && <span>This field is required</span>}
        </div>
        <div>
          <textarea {...register('text', { required: true })} />
          {errors.text && <span>This field is required</span>}
        </div>

        <Grid4>
          <hr />
          <p>Section 3</p>
        </Grid4>
        <Grid2>
          <label htmlFor="lastName">
            Last name
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: true })}
            />
          </label>
          {errors.lastName && <span>This field is required</span>}
        </Grid2>
        <div>
          <label htmlFor="firstName">
            First name
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: true })}
            />
          </label>
          {errors.firstName && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="pronouns">
            Pronouns
            <input
              id="pronouns"
              type="text"
              {...register('pronouns', { required: true })}
            />
          </label>
          {errors.pronouns && <span>This field is required</span>}
        </div>
        <Grid2>
          <label htmlFor="middleName">
            Middle name
            <input
              id="middleName"
              type="text"
              {...register('middleName', { required: true })}
            />
          </label>
          {errors.middleName && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="displayName">
            Display name
            <input
              id="displayName"
              type="text"
              {...register('displayName', { required: true })}
            />
          </label>
          {errors.displayName && <span>This field is required</span>}
        </Grid2>
        <Grid4>
          <label htmlFor="option">
            Select an option
            <select id="option" {...register('option', { required: true })}>
              <option>--</option>
              {selectOptions.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>
          {errors.option && <span>This field is required</span>}
        </Grid4>
        <Grid2>
          <label htmlFor="phone">
            Phone
            <input
              id="phone"
              pattern="[+]{1}[0-9]{11,14}"
              type="tel"
              {...register('phone', { required: true })}
            />
          </label>
          {errors.phone && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
            />
          </label>
          {errors.email && <span>This field is required</span>}
        </Grid2>
        <div>
          <p>Check at least one</p>
          {checkboxOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="checkbox"
                  value={op.value}
                  {...register('checkbox', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.checkbox && <span>This field is required</span>}
        </div>
        <div>
          Choose one
          {radioOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="radio"
                  value={op.value}
                  {...register('radio', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.radio && <span>This field is required</span>}
        </div>
        <div>
          <textarea {...register('text', { required: true })} />
          {errors.text && <span>This field is required</span>}
        </div>

        <Grid4>
          <hr />
          <p>Section 4</p>
        </Grid4>
        <Grid2>
          <label htmlFor="lastName">
            Last name
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: true })}
            />
          </label>
          {errors.lastName && <span>This field is required</span>}
        </Grid2>
        <div>
          <label htmlFor="firstName">
            First name
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: true })}
            />
          </label>
          {errors.firstName && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="pronouns">
            Pronouns
            <input
              id="pronouns"
              type="text"
              {...register('pronouns', { required: true })}
            />
          </label>
          {errors.pronouns && <span>This field is required</span>}
        </div>
        <Grid2>
          <label htmlFor="middleName">
            Middle name
            <input
              id="middleName"
              type="text"
              {...register('middleName', { required: true })}
            />
          </label>
          {errors.middleName && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="displayName">
            Display name
            <input
              id="displayName"
              type="text"
              {...register('displayName', { required: true })}
            />
          </label>
          {errors.displayName && <span>This field is required</span>}
        </Grid2>
        <Grid4>
          <label htmlFor="option">
            Select an option
            <select id="option" {...register('option', { required: true })}>
              <option>--</option>
              {selectOptions.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>
          {errors.option && <span>This field is required</span>}
        </Grid4>
        <Grid2>
          <label htmlFor="phone">
            Phone
            <input
              id="phone"
              pattern="[+]{1}[0-9]{11,14}"
              type="tel"
              {...register('phone', { required: true })}
            />
          </label>
          {errors.phone && <span>This field is required</span>}
        </Grid2>
        <Grid2>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
            />
          </label>
          {errors.email && <span>This field is required</span>}
        </Grid2>
        <div>
          <p>Check at least one</p>
          {checkboxOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="checkbox"
                  value={op.value}
                  {...register('checkbox', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.checkbox && <span>This field is required</span>}
        </div>
        <div>
          Choose one
          {radioOptions.map(op => (
            <p key={op.value}>
              <label htmlFor={op.value}>
                <input
                  id={op.value}
                  type="radio"
                  value={op.value}
                  {...register('radio', { required: true })}
                />{' '}
                {op.label}
              </label>
            </p>
          ))}
          {errors.radio && <span>This field is required</span>}
        </div>
        <div>
          <textarea {...register('text', { required: true })} />
          {errors.text && <span>This field is required</span>}
        </div> */}
        <div>
          <input type="submit" />
        </div>
        {/* eslint-disable-next-line no-plusplus */}
        <p>Render counter: {counter++}</p>
      </GridWrapper>
    </form>
  )
}

export default {
  component: ReactHookForm,
  title: 'Experiments/React hook form',
}
