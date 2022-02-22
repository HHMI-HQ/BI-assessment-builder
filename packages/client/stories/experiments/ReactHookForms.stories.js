import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { range } from 'lodash'
import { datatype, lorem, name } from 'faker'

let counter = 1

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 20px;
  grid-column-gap: 10px;

  input,
  select {
    width: 100%;
    height: 40px;
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

export const ReactHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <GridWrapper>
        <Grid2>
          <label htmlFor="lastName">
            Last name
            <input
              id="lastName"
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
              {...register('displayName', { required: true })}
            />
          </label>
          {errors.displayName && <span>This field is required</span>}
        </Grid2>
        <Grid4>
          <label htmlFor="option">
            Select an option
            <select id="option" {...register('option', { required: true })}>
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
        <input type="submit" />
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
