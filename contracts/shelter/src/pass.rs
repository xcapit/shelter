use soroban_sdk::{contracttype, crypto::Hash, BytesN, Env};

#[contracttype]
#[derive(Clone)]
pub struct Pass {
    pub public_key: BytesN<32>,
    pub signature: BytesN<64>,
}

impl Pass {
    pub fn verify(&self, env: &Env, message: Hash<32>) {
        env.crypto()
            .ed25519_verify(&self.public_key, &message.into(), &self.signature);
    }
}
