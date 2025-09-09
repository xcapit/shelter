export STELLAR_FEE?=100
export STELLAR_NETWORK?=testnet
export STELLAR_ACCOUNT?=steward
export STELLAR_RPC?=https://soroban-testnet.stellar.org
export STELLAR_NETWORK_PASSPHRASE?="Test SDF Network ; September 2015"

default: build

all: test

test: build
	cargo test

coverage: build
	cargo llvm-cov test --html --open

build:
	rm -rf target/wasm32v1-none/
	stellar contract build
	@ls -l target/wasm32v1-none/release/*.wasm
	stellar contract optimize --wasm target/wasm32v1-none/release/shelter.wasm

upload:
	stellar contract upload --source $(STELLAR_ACCOUNT) --network $(STELLAR_NETWORK) --rpc-url $(STELLAR_RPC) --network-passphrase "$(STELLAR_NETWORK_PASSPHRASE)" --fee $(STELLAR_FEE) --wasm target/wasm32v1-none/release/shelter.optimized.wasm

fmt:
	cargo fmt --all

bindings: test
	stellar contract bindings typescript --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC --network $(STELLAR_NETWORK) --output-dir ./out/sac-sdk --overwrite
	stellar contract bindings typescript --wasm ./target/wasm32v1-none/release/shelter.wasm --network $(STELLAR_NETWORK) --output-dir ./out/shelter-sdk --overwrite

clean:
	cargo clean
