export STELLAR_NETWORK?=testnet

default: build

all: test

test: build
	cargo test

coverage: build
	cargo llvm-cov test --html --open

build:
	stellar contract build
	@ls -l target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

bindings: test
	stellar contract bindings typescript --id CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC --network $(STELLAR_NETWORK) --output-dir ./out/sac-sdk --overwrite
	stellar contract bindings typescript --wasm ./target/wasm32v1-none/release/shelter.wasm --network $(STELLAR_NETWORK) --output-dir ./out/shelter-sdk --overwrite

clean:
	cargo clean
