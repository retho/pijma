import React, {FunctionComponent, ReactNode} from 'react'

import {
  css,
  Modal,
  ModalProps,
  SimpleTransition,
  SimpleTransitionProps,
  Box,
  Pos,
  Card,
  Flex,
  FlexItem,
  CardProps,
  FlexProps,
  styled,
  PosProps,
  FlexNonProps,
  PosNonProps,
  CardNonProps,
} from '@qiwi/pijma-core'

import {Icon} from '@qiwi/pijma-media'
import {Paragraph} from '../typography'

const contentTransitionVertical: FunctionComponent<SimpleTransitionProps> = (props) => <SimpleTransition {...props}/>
const contentTransitionHorizontal: FunctionComponent<SimpleTransitionProps> = (props) => <SimpleTransition {...props}/>

const translate3d = {
  vertical: '0, 100%, 0',
  horizontal: '100%, 0, 0',
}

const defaultProps = (direction: 'vertical' | 'horizontal') => ({
  timeout: {
    enter: 370,
    exit: 250,
  },
  enterClassName: (timeout: number) => css({
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    transition: `opacity ${timeout}ms ease, transform ${timeout}ms ease`,
  }),
  exitClassName: (timeout: number) => css({
    opacity: 0,
    transform: `translate3d(${translate3d[direction]})`,
    transition: `opacity ${timeout}ms ease, transform ${timeout}ms ease`,
  }),
})

contentTransitionVertical.defaultProps = defaultProps('vertical')
contentTransitionHorizontal.defaultProps = defaultProps('horizontal')

const backdropTransition: FunctionComponent<SimpleTransitionProps> = (props) => <SimpleTransition {...props}/>

backdropTransition.defaultProps = {
  timeout: {
    enter: 370,
    exit: 250,
  },
  enterClassName: (timeout: number) => css({
    opacity: 1,
    transition: `opacity ${timeout}ms ease`,
  }),
  exitClassName: (timeout: number) => css({
    opacity: 0,
    transition: `opacity ${timeout}ms ease`,
  }),
}

const StyledModal = styled(Modal)<ModalProps>({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
})

export interface DropUpProps {
  show: boolean
  onShow?: () => void
  onHide: () => void
  onBack?: () => void
  autoFocus?: boolean
  horizontal?: boolean
  title: string
  footer?: ReactNode
}

const FlexPosCardNonProps = FlexNonProps.concat(PosNonProps).concat(CardNonProps)

const FlexPosCard = styled(Flex.withComponent(Pos).withComponent(Card), {
  shouldForwardProp: (prop) => !FlexPosCardNonProps.includes(prop),
})<PosProps & CardProps & FlexProps>()

const PosCard = Card.withComponent(Pos)

export const DropUp: FunctionComponent<DropUpProps> = (props) => (
  <StyledModal
    autoFocus={props.autoFocus}
    show={props.show}
    onShow={props.onShow}
    onHide={props.onHide}
    renderBackdrop={({onClick}) => (
      <Pos type="fixed" zIndex="auto" top={0} right={0} bottom={0} left={0}>
        <Card bg="rgba(245, 245, 245, 0.8)" width={1} height={1} onClick={onClick}/>
      </Pos>
    )}
    transition={props.horizontal ? contentTransitionHorizontal : contentTransitionVertical}
    backdropTransition={backdropTransition}
    children={
      <FlexPosCard
        display="flex"
        direction="column"
        width={1}
        maxHeight="calc(100% - 44px)"
        bg="#fff"
        type="absolute"
        bottom={0}
        s="0px 0px 64px 0px rgba(0, 0, 0, 0.16)"
      >
        <PosCard width={1} px={6} py={4} s="0 1px 2px 0 rgba(0, 0, 0, 0.12)" zIndex={1}>
          <Flex width={1} align="center">
            {props.onBack ? (
              <Box width={6} height={6} mr={3} onClick={props.onBack}>
                <Icon name="arrow-left"/>
              </Box>
            ) : (
              null
            )}
            <Paragraph size="m" bold>{props.title}</Paragraph>
            <Box width={6} height={6} ml="auto" onClick={props.onHide}>
              <Icon name="cross"/>
            </Box>
          </Flex>
        </PosCard>
        <FlexItem display="flex" grow={1} width={1} minHeight={0}>
          <FlexItem grow={1} minHeight={0} overflow="auto">
            {props.children}
          </FlexItem>
        </FlexItem>
        {props.footer ? (
          <Box p={4} width={1}>
            {props.footer}
          </Box>
        ) : (
          null
        )}
      </FlexPosCard>
    }
  />
)

DropUp.defaultProps = {
  autoFocus: true,
}
