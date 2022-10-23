import styled from 'styled-components'

const Box = styled.div`
  ${props => props.padding && `padding: ${props.padding}px;`}
  ${props => props.width && `width: ${props.width};`}
`

const Flex = styled(Box)`
  display: flex;
  flex-direction: ${props => props.flexDir || 'row'};
  ${props => props.position && `position: ${props.position};`}
  ${props => props.align && `align-items: ${props.align};`}
  ${props => props.justify && `justify-content: ${props.justify};`}
`

export { styled, Box, Flex }
