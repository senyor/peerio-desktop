const { expect } = require('chai');
const { getAttributeInParentChain } = require('../../src/helpers/dom');

const mockRootElement = {
    attributes: { 'data-id': true },
    getAttribute(name) {
        return this.attributes[name];
    },
    parentElement: null
};
const mockChildElement = {
    attributes: { 'child-data-id': true },
    getAttribute(name) {
        return this.attributes[name];
    },
    parentElement: mockRootElement
};

describe('dom helper: getAttributeInParentChain', () => {
    it('should handle undefined element', () => {
        const expected = null;
        let actual = getAttributeInParentChain(undefined, 'does not matter');
        expect(actual).to.be.equal(expected);
        actual = getAttributeInParentChain(null, 'does not matter');
        expect(actual).to.be.equal(expected);
    });
    it('should fail to find attribute if it is not there', () => {
        const expected = null;
        const actual = getAttributeInParentChain(
            mockChildElement,
            'i do not exist'
        );
        expect(actual).to.equal(expected);
    });
    it('should find attribute in a tree', () => {
        const expected = true;
        let actual = getAttributeInParentChain(mockRootElement, 'data-id');
        actual.should.equal(expected);
        actual = getAttributeInParentChain(mockChildElement, 'data-id');
        actual.should.equal(expected);
        actual = getAttributeInParentChain(mockChildElement, 'child-data-id');
        actual.should.equal(expected);
    });
});
