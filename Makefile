include credentials.mk

.PHONY: all
all: Mixer.zxp

Mixer.zxp:
	mkdir -p build
	cp $(shell git ls-files) build
	ZXPSignCmd-64bit -sign build Mixer.zxp $(P12_CERT) $(P12_PASS)
