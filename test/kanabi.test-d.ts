import { TypedContract } from '..'
import {
  AbiTypeToPrimitiveType,
  CairoBigInt,
  CairoByteArray,
  CairoBytes31,
  CairoContractAddress,
  CairoEthAddress,
  CairoFelt,
  CairoFunction,
  CairoInt,
  CairoTuple,
  CairoU256,
  CairoVoid,
  EventToPrimitiveType,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  FunctionArgs,
  FunctionRet,
  StringToPrimitiveType,
} from '../kanabi'
import { ABI } from './example'
import { assertType, expectTypeOf, test } from 'vitest'

type TAbi = typeof ABI

function returnVoid() {}

const voidValue = returnVoid()
const bigIntValue = 105n
const intValue = 10
const stringValue = 's'
const emptyArray: [] = []
const boolValue = true

test('Cairo Types', () => {
  assertType<CairoFelt>('core::felt252')
  assertType<CairoInt>('core::integer::u8')
  assertType<CairoInt>('core::integer::u16')
  assertType<CairoInt>('core::integer::u32')
  assertType<CairoBigInt>('core::integer::u64')
  assertType<CairoBigInt>('core::integer::u128')
  assertType<CairoU256>('core::integer::u256')
  assertType<CairoContractAddress>(
    'core::starknet::contract_address::ContractAddress',
  )
  assertType<CairoEthAddress>('core::starknet::eth_address::EthAddress')
  assertType<CairoFunction>('function')
  assertType<CairoVoid>('()')
  assertType<CairoTuple>('()')
  assertType<CairoTuple>('(1)')
  assertType<CairoTuple>('(1, 2n)')
  assertType<CairoTuple>("(1, 2n, 'string')")
  assertType<CairoTuple>('(1, 2, 3, 4, 5)')
})

test('Cairo Types Errors', () => {
  // @ts-expect-error
  assertType<CairoFelt>('core::integer:u8')
  // @ts-expect-error
  assertType<CairoInt>('core::integer::u64')
  // @ts-expect-error
  assertType<CairoInt>('core::integer::u128')
  // @ts-expect-error
  assertType<CairoInt>('core::integer::u256')
  // @ts-expect-error
  assertType<CairoBigInt>('core::integer::u8')
  // @ts-expect-error
  assertType<CairoBigInt>('core::integer::u16')
  // @ts-expect-error
  assertType<CairoBigInt>('core::integer::u32')
  // @ts-expect-error
  assertType<CairoContractAddress>('core::felt')
  // @ts-expect-error
  assertType<CairoContractAddress>('core::integer::u8')
  // @ts-expect-error
  assertType<CairoFunction>('core::integer::u8')
  // @ts-expect-error
  assertType<CairoVoid>('function')
  // @ts-expect-error
  assertType<CairoTuple>('(')
})

test('FunctionArgs', () => {
  assertType<FunctionArgs<TAbi, 'fn_felt'>>(bigIntValue)
  assertType<FunctionArgs<TAbi, 'fn_felt_u8_bool'>>([
    bigIntValue,
    intValue,
    boolValue,
  ])
  assertType<FunctionArgs<TAbi, 'fn_felt_u8_bool_out_address_felt_u8_bool'>>([
    bigIntValue,
    intValue,
    boolValue,
  ])

  assertType<FunctionArgs<TAbi, 'fn_struct'>>({
    felt: bigIntValue,
    int128: bigIntValue,
    tuple: [intValue, intValue],
  })
  assertType<FunctionArgs<TAbi, 'fn_struct_array'>>([
    { felt: bigIntValue, int128: bigIntValue, tuple: [intValue, intValue] },
  ])

  assertType<FunctionArgs<TAbi, 'fn_simple_array'>>([intValue, intValue])

  assertType<FunctionArgs<TAbi, 'fn_out_enum_array'>>([])

  assertType<FunctionArgs<TAbi, 'fn_enum'>>({ felt: bigIntValue })
  assertType<FunctionArgs<TAbi, 'fn_enum'>>({ int128: bigIntValue })
  assertType<FunctionArgs<TAbi, 'fn_enum'>>({ tuple: [intValue, intValue] })

  assertType<FunctionArgs<TAbi, 'fn_enum_array'>>([
    { felt: bigIntValue },
    { int128: bigIntValue },
    { tuple: [intValue, intValue] },
  ])

  assertType<FunctionArgs<TAbi, 'fn_result'>>({ Ok: bigIntValue })
  assertType<FunctionArgs<TAbi, 'fn_result'>>({ Err: intValue })

  assertType<FunctionArgs<TAbi, 'fn_nested_result'>>({ Ok: intValue })
  assertType<FunctionArgs<TAbi, 'fn_nested_result'>>({ Ok: undefined })
  assertType<FunctionArgs<TAbi, 'fn_nested_result'>>({ Err: bigIntValue })

  assertType<FunctionArgs<TAbi, 'fn_eth_address'>>(stringValue)

  assertType<FunctionArgs<TAbi, 'fn_span'>>([
    { felt: bigIntValue, int128: bigIntValue, tuple: [intValue, intValue] },
  ])

  assertType<FunctionArgs<TAbi, 'fn_bytes31'>>(stringValue)
  assertType<FunctionArgs<TAbi, 'fn_byte_array'>>(stringValue)
})

test('FunctionArgs Errors', () => {
  assertType<FunctionArgs<TAbi, 'fn_felt'>>(
    // @ts-expect-error
    [bigIntValue, bigIntValue],
  )
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_felt'>>(boolValue)
  assertType<FunctionArgs<TAbi, 'fn_felt_u8_bool'>>([
    bigIntValue,
    intValue,
    // @ts-expect-error
    intValue,
  ])
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_felt_u8_bool_out_address_felt_u8_bool'>>([
    bigIntValue,
    intValue,
  ])
  assertType<FunctionArgs<TAbi, 'fn_struct'>>({
    felt: bigIntValue,
    int128: bigIntValue,
    // @ts-expect-error
    tuple: [intValue, boolValue],
  })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_struct'>>({
    int128: bigIntValue,
    tuple: [intValue, intValue],
  })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_out_enum_array'>>([intValue])
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_result'>>({ Ok: voidValue })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_result'>>({ Err: boolValue })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_nested_result'>>({ Ok: emptyArray })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_nested_result'>>({ Err: stringValue })
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_eth_address'>>(voidValue)
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_span'>>([bigIntValue])
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_bytes31'>>(voidValue)
  // @ts-expect-error
  assertType<FunctionArgs<TAbi, 'fn_byte_array'>>(intValue)
})

test('FunctionRet', () => {
  assertType<FunctionRet<TAbi, 'fn_felt_out_felt'>>(bigIntValue)

  assertType<FunctionRet<TAbi, 'fn_felt_u8_bool_out_address_felt_u8_bool'>>([
    stringValue,
    bigIntValue,
    intValue,
    boolValue,
  ])
  assertType<FunctionRet<TAbi, 'fn_out_simple_array'>>([intValue, intValue])

  assertType<FunctionRet<TAbi, 'fn_out_simple_option'>>(intValue)
  assertType<FunctionRet<TAbi, 'fn_out_simple_option'>>(undefined)

  assertType<FunctionRet<TAbi, 'fn_out_nested_option'>>(intValue)
  assertType<FunctionRet<TAbi, 'fn_out_nested_option'>>(undefined)

  assertType<FunctionRet<TAbi, 'fn_out_enum_array'>>([])
  assertType<FunctionRet<TAbi, 'fn_out_enum_array'>>([
    { felt: bigIntValue },
    { int128: bigIntValue },
    { tuple: [intValue, intValue] },
  ])

  assertType<FunctionRet<TAbi, 'fn_out_result'>>({ Ok: intValue })
  assertType<FunctionRet<TAbi, 'fn_out_result'>>({ Err: bigIntValue })
})

test('FunctionRet Errors', () => {
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_felt'>>(intValue)
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_felt_u8_bool'>>(bigIntValue)
  assertType<FunctionRet<TAbi, 'fn_felt_u8_bool_out_address_felt_u8_bool'>>(
    // @ts-expect-error
    emptyArray,
  )
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_simple_array'>>(intValue)
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_simple_option'>>(emptyArray)
  assertType<FunctionRet<TAbi, 'fn_out_enum_array'>>([
    { felt: bigIntValue },
    { int128: bigIntValue },
    { tuple: [intValue, intValue] },
    // @ts-expect-error
    { x: 1 },
  ])
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_nested_option'>>([intValue, intValue])
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_simple_option'>>(voidValue)
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_result'>>({ Ok: stringValue })
  // @ts-expect-error
  assertType<FunctionRet<TAbi, 'fn_out_result'>>({ Err: emptyArray })
})

test('ExtractAbiFunction', () => {
  const fnValue = {
    type: 'function',
    name: 'fn_felt_out_felt',
    inputs: [
      {
        name: 'felt',
        type: 'core::felt252',
      },
    ],
    outputs: [
      {
        type: 'core::felt252',
      },
    ],
    state_mutability: 'view',
  } as const
  assertType<ExtractAbiFunction<TAbi, 'fn_felt_out_felt'>>(fnValue)
})

test('ExtractAbiFunctionName', () => {
  type Expected =
    | 'fn_felt'
    | 'fn_felt_u8_bool'
    | 'fn_felt_u8_bool_out_address_felt_u8_bool'
    | 'fn_felt_out_felt'
    | 'fn_out_simple_option'
    | 'fn_out_nested_option'
    | 'fn_simple_array'
    | 'fn_out_simple_array'
    | 'fn_struct_array'
    | 'fn_struct'
    | 'fn_enum'
    | 'fn_enum_array'
    | 'fn_out_enum_array'
    | 'fn_result'
    | 'fn_out_result'
    | 'fn_nested_result'
    | 'fn_eth_address'
    | 'fn_span'
    | 'fn_bytes31'
    | 'fn_byte_array'

  expectTypeOf<ExtractAbiFunctionNames<TAbi>>().toEqualTypeOf<Expected>()
})

test('AbiTypeToPrimitiveType', () => {
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFelt>>(intValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFelt>>(bigIntValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFelt>>(stringValue)

  assertType<AbiTypeToPrimitiveType<TAbi, CairoInt>>(intValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoInt>>(bigIntValue)

  assertType<AbiTypeToPrimitiveType<TAbi, CairoBigInt>>(intValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoBigInt>>(bigIntValue)

  assertType<AbiTypeToPrimitiveType<TAbi, CairoU256>>(intValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoContractAddress>>(stringValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoEthAddress>>(stringValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFunction>>(intValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoVoid>>(voidValue)

  assertType<AbiTypeToPrimitiveType<TAbi, CairoBytes31>>(stringValue)
  assertType<AbiTypeToPrimitiveType<TAbi, CairoByteArray>>(stringValue)
})

test('AbiTypeToPrimitiveType Errors', () => {
  // @ts-expect-error CairoFelt should be number, bigint or string
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFelt>>(boolValue)
  // @ts-expect-error CairoInt should be number or bigint
  assertType<AbiTypeToPrimitiveType<TAbi, CairoInt>>(voidValue)
  // @ts-expect-error CairoBigInt should be number or bigint
  assertType<AbiTypeToPrimitiveType<TAbi, CairoBigInt>>(voidValue)
  // @ts-expect-error ContractAddress should be string
  assertType<AbiTypeToPrimitiveType<TAbi, CairoContractAddress>>(intValue)
  // @ts-expect-error EthAddress should be string
  assertType<AbiTypeToPrimitiveType<TAbi, CairoEthAddress>>(intValue)
  // @ts-expect-error CairoFunction should be int
  assertType<AbiTypeToPrimitiveType<TAbi, CairoFunction>>(bigIntValue)
  // @ts-expect-error CairoVoid should be void
  assertType<AbiTypeToPrimitiveType<TAbi, CairoVoid>>(intValue)
  // @ts-expect-error CairoBytes31 should be string
  assertType<AbiTypeToPrimitiveType<TAbi, CairoBytes31>>(bigIntValue)
  // @ts-expect-error CairoByteArray should be string
  assertType<AbiTypeToPrimitiveType<TAbi, CairoBytes31>>(voidValue)
})

test('StringToPrimitiveType', () => {
  // TODO: add tests for struct, enum and tuple
  assertType<StringToPrimitiveType<TAbi, CairoFelt>>(bigIntValue)
  assertType<StringToPrimitiveType<TAbi, CairoFelt>>(bigIntValue)
  assertType<StringToPrimitiveType<TAbi, CairoInt>>(intValue)
  assertType<StringToPrimitiveType<TAbi, CairoInt>>(bigIntValue)
  assertType<StringToPrimitiveType<TAbi, CairoBigInt>>(bigIntValue)
  assertType<StringToPrimitiveType<TAbi, CairoContractAddress>>(stringValue)
  assertType<StringToPrimitiveType<TAbi, CairoEthAddress>>(stringValue)
  assertType<StringToPrimitiveType<TAbi, CairoFunction>>(intValue)
  assertType<StringToPrimitiveType<TAbi, CairoVoid>>(voidValue)
  assertType<StringToPrimitiveType<TAbi, CairoBytes31>>(stringValue)
  assertType<StringToPrimitiveType<TAbi, CairoByteArray>>(stringValue)
})

test('StringToPrimitiveType Errors', () => {
  // TODO: add tests for struct, enum and tuple
  // @ts-expect-error CairoFelt should be bigint
  assertType<StringToPrimitiveType<TAbi, CairoFelt>>(voidValue)
  // @ts-expect-error CairoInt should be number or bigint
  assertType<StringToPrimitiveType<TAbi, CairoInt>>(voidValue)
  // @ts-expect-error CairoBigInt should be bigint
  assertType<StringToPrimitiveType<TAbi, CairoBigInt>>(boolValue)
  // @ts-expect-error ContractAddress should be bigint
  assertType<StringToPrimitiveType<TAbi, CairoContractAddress>>(intValue)
  // @ts-expect-error EthAddress should be bigint
  assertType<StringToPrimitiveType<TAbi, CairoEthAddress>>(intValue)
  // @ts-expect-error CairoFunction should be int
  assertType<StringToPrimitiveType<TAbi, CairoFunction>>(bigIntValue)
  // @ts-expect-error CairoVoid should be void
  assertType<StringToPrimitiveType<TAbi, CairoVoid>>(intValue)
  // @ts-expect-error CairoBytes31 should be string
  assertType<StringToPrimitiveType<TAbi, CairoBytes31>>(intValue)
  // @ts-expect-error CairoByteArray should be string
  assertType<StringToPrimitiveType<TAbi, CairoByteArray>>(bigIntValue)
})

test('ContractFunctions', () => {
  // @ts-expect-error
  const contract: TypedContract<TAbi> = never

  contract.fn_felt(1) // Call with args
  contract.fn_felt(1, { parseRequest: true }) // Call withe invokeOptions
  contract.fn_felt(['0x0', '0x1']) // call with CallData

  // @ts-expect-error fn_felt argument should be  string | number | bigint
  contract.fn_felt(true)

  contract.fn_out_simple_option()
  contract.fn_out_simple_option({ parseResponse: true })
  contract.fn_out_simple_option(['0x0', '0x1'])
})

test('ContractFunctionsPopulateTransaction', () => {
  // @ts-expect-error
  const contract: TypedContract<TAbi> = never

  // @ts-expect-error
  contract.populateTransaction.fn_felt()
  contract.populateTransaction.fn_felt(1)
  contract.populateTransaction.fn_simple_array([1, 2, 3])
})

test('populate', () => {
  // @ts-expect-error
  const contract: TypedContract<TAbi> = never

  contract.populate('fn_felt', 1n)
  contract.populate('fn_felt_u8_bool', [1n, 2, true])
})

test('StringToPrimitiveTypeEvent', () => {
  // TODO: add tests for struct, enum and tuple
  // Accept everything (unknown) for wrong types, this is done intentionally to
  // avoid rejecting types when abiwan make a mistake, we'll probably alter this
  // behavior when it gets mature enough
  assertType<StringToPrimitiveType<TAbi, 'wrong_type_name'>>({
    TestCounterIncreased: {
      amount: 1,
    },
  })

  assertType<StringToPrimitiveType<TAbi, 'example::example_contract::Event'>>({
    TestCounterIncreased: {
      amount: 1,
    },
  })
  assertType<StringToPrimitiveType<TAbi, 'example::example_contract::Event'>>({
    TestCounterDecreased: {
      amount: 1,
    },
  })
  assertType<StringToPrimitiveType<TAbi, 'example::example_contract::Event'>>({
    TestEnum: {
      Var1: {
        member: 1,
      },
    },
  })

  // @ts-expect-error
  assertType<EventToPrimitiveType<TAbi, 'wrong_event'>>()
})
