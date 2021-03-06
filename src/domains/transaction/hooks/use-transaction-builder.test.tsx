import { TransferInput } from "@arkecosystem/platform-sdk/dist/contracts";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId, getDefaultWalletMnemonic } from "utils/testing-library";

import { useTransactionBuilder } from "./use-transaction-builder";

describe("Use Transaction Builder Hook", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should sign transfer", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile));

		const input: TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {
				mnemonic: getDefaultWalletMnemonic(),
			},
		};

		const transaction = await result.current.build("transfer", input);
		expect(transaction.id()).toBe("98e5294a2cdd0f93fc94e8eb85ba707fdb798090b89503cebc33756b48a101c2");
	});

	it("should sign transfer with multisignature wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile));

		jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		jest.spyOn(wallet, "multiSignature").mockReturnValue({
			min: 2,
			publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
		});

		const input: TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		const transaction = await result.current.build("transfer", input);
		expect(transaction.id()).toBe("4f42da4b1e0428d49993a3dccc7ab52d43b9426074d754dbf353fb79cd9a5db9");

		jest.clearAllMocks();
	});

	it("should sign transfer with ledger", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile));

		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const input: TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		const transaction = await result.current.build("transfer", input);
		expect(transaction.id()).toBe("5ef0e7225bed4cb4c3c763ac4d3bd37f8c8d1b93e5edf540b8cc444bce4cdca5");

		jest.clearAllMocks();
	});

	it("should sign transfer with cold ledger wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile));

		jest.spyOn(wallet, "publicKey").mockImplementation(() => undefined);
		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb",
		);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockResolvedValue(
			"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
		);

		const input: TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		const transaction = await result.current.build("transfer", input);
		expect(transaction.id()).toBe("50f6046de032ea49b5d2894c5f027527564764c7d84633c146babada1707dd9f");

		jest.clearAllMocks();
	});

	it("should abort build with ledger", async () => {
		const abortCtrl = new AbortController();
		const abortSignal = abortCtrl.signal;

		const { result } = renderHook(() => useTransactionBuilder(profile));

		jest.spyOn(wallet, "isLedger").mockImplementation(() => true);
		jest.spyOn(wallet.coin().ledger(), "signTransaction").mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve(
								"dd3f96466bc50077b01e441cd35eb3c5aabd83670d371c2be8cc772ed189a7315dd66e88bde275d89a3beb7ef85ef84a52ec4213f540481cd09ecf6d21e452bf",
							),
						20000,
					),
				),
		);

		const input: TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		setTimeout(() => abortCtrl.abort(), 100);

		await expect(result.current.build("transfer", input, { abortSignal })).rejects.toEqual("ERR_ABORT");

		jest.clearAllMocks();
	});
});
