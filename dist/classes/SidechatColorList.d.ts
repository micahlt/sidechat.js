export default SidechatColorList;
export type SidechatColor = {
    /**
     * - hex code of primary color
     */
    primary: string;
    /**
     * - hex code of secondary color
     */
    secondary: string;
};
/**
 * @typedef SidechatColor
 * @prop {String} primary - hex code of primary color
 * @prop {String} secondary - hex code of secondary color
 */
/**
 * List of colors compatible with user conversation icons
 * @prop {SidechatColor[]} colors - list of color themes for user icons
 */
declare class SidechatColorList {
    colors: {
        primary: string;
        secondary: string;
    }[];
}
//# sourceMappingURL=SidechatColorList.d.ts.map